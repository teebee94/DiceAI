package com.diceai;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.ValueCallback;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import android.webkit.ConsoleMessage;
import android.util.Log;
import android.widget.Toast;
import java.io.File;
import java.io.IOException;

public class MainActivity extends Activity {

    private WebView webView;
    private static final int FILE_CHOOSER_REQUEST = 1;
    private static final int CAMERA_REQUEST = 2;
    private ValueCallback<Uri[]> filePathCallback;
    private Uri cameraImageUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Create WebView
        webView = new WebView(this);
        setContentView(webView);

        // Enable JavaScript
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Enable localStorage
        webSettings.setDatabaseEnabled(true);
        webSettings.setDomStorageEnabled(true);

        // Enable file access and mixed content for file chooser
        webSettings.setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // WebViewClient to handle navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }
        });

        // WebChromeClient for file chooser and console logs
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams) {

                Log.d("DiceAI", "onShowFileChooser called");

                // Cancel any existing callback
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }

                MainActivity.this.filePathCallback = filePathCallback;

                try {
                    // Create intent with multiple options
                    Intent galleryIntent = new Intent(Intent.ACTION_PICK);
                    galleryIntent.setType("image/*");
                    galleryIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);

                    // Create camera intent as option
                    Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

                    // Create file for camera photo
                    File photoFile = createImageFile();
                    if (photoFile != null) {
                        cameraImageUri = Uri.fromFile(photoFile);
                        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri);
                    }

                    // Create chooser with both options
                    Intent chooserIntent = Intent.createChooser(galleryIntent, "Select Images or Take Photo");
                    chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[] { cameraIntent });

                    startActivityForResult(chooserIntent, FILE_CHOOSER_REQUEST);

                    Log.d("DiceAI", "File chooser intent started");
                    return true;

                } catch (Exception e) {
                    Log.e("DiceAI", "Error opening file chooser: " + e.getMessage());
                    Toast.makeText(MainActivity.this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();

                    if (MainActivity.this.filePathCallback != null) {
                        MainActivity.this.filePathCallback.onReceiveValue(null);
                        MainActivity.this.filePathCallback = null;
                    }
                    return false;
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("WebView", consoleMessage.message() + " -- Line: " + consoleMessage.lineNumber() +
                        " of " + consoleMessage.sourceId());
                return true;
            }
        });

        // Load the HTML file from assets
        webView.loadUrl("file:///android_asset/index.html");

        // Request permissions for photo access
        requestPermissions();
    }

    private File createImageFile() {
        try {
            String imageFileName = "DICEAI_" + System.currentTimeMillis();
            File storageDir = getExternalFilesDir(null);
            return File.createTempFile(imageFileName, ".jpg", storageDir);
        } catch (IOException e) {
            Log.e("DiceAI", "Error creating image file: " + e.getMessage());
            return null;
        }
    }

    private void requestPermissions() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            // Android 13+
            requestPermissions(new String[] {
                    android.Manifest.permission.READ_MEDIA_IMAGES,
                    android.Manifest.permission.CAMERA
            }, 100);
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            // Android 6-12
            requestPermissions(new String[] {
                    android.Manifest.permission.READ_EXTERNAL_STORAGE,
                    android.Manifest.permission.CAMERA
            }, 100);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        Log.d("DiceAI", "onActivityResult - requestCode: " + requestCode + ", resultCode: " + resultCode);

        if (requestCode == FILE_CHOOSER_REQUEST) {
            if (filePathCallback == null) {
                Log.e("DiceAI", "filePathCallback is null!");
                return;
            }

            Uri[] results = null;

            if (resultCode == Activity.RESULT_OK) {
                if (data != null) {
                    // Gallery selection
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[] { Uri.parse(dataString) };
                        Log.d("DiceAI", "Single image selected from gallery");
                    } else if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        results = new Uri[count];
                        for (int i = 0; i < count; i++) {
                            results[i] = data.getClipData().getItemAt(i).getUri();
                        }
                        Log.d("DiceAI", "Multiple images selected: " + count);
                    }
                } else if (cameraImageUri != null) {
                    // Camera photo
                    results = new Uri[] { cameraImageUri };
                    Log.d("DiceAI", "Photo captured from camera");
                }
            } else {
                Log.d("DiceAI", "File selection cancelled");
            }

            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
            cameraImageUri = null;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == 100) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }

            if (allGranted) {
                Log.d("DiceAI", "All permissions granted");
                // Permissions granted - reload the page
                webView.reload();
                Toast.makeText(this, "✅ Permissions granted! Tap 'Select Photos' to upload.",
                        Toast.LENGTH_LONG).show();
            } else {
                Log.d("DiceAI", "Some permissions denied");
                Toast.makeText(this,
                        "⚠️ Photo permissions are required to upload images from gallery",
                        Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
