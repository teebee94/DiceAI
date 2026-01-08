package com.diceai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.diceai.data.DiceDatabase
import com.diceai.data.DiceRepository
import com.diceai.ui.DiceViewModel
import com.diceai.ui.DiceViewModelFactory
import com.diceai.ui.screens.DiceAIScreen
import com.diceai.ui.theme.DiceAITheme

class NativeMainActivity : ComponentActivity() {
    
    private val viewModel: DiceViewModel by viewModels {
        val database = DiceDatabase.getDatabase(applicationContext)
        val repository = DiceRepository(database.diceDao())
        DiceViewModelFactory(repository)
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            DiceAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    DiceAIScreen(viewModel = viewModel)
                }
            }
        }
    }
}
