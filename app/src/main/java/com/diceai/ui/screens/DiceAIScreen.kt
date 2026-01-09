package com.diceai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.diceai.data.DiceResult
import com.diceai.data.Statistics
import com.diceai.ui.DiceViewModel
import com.diceai.ui.Prediction
import com.diceai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)

@Composable
fun DiceAIScreen(viewModel: DiceViewModel) {
    val recentResults by viewModel.recentResults.collectAsState()
    val statistics by viewModel.statistics.collectAsState()
    val prediction by viewModel.prediction.collectAsState()
    
    var periodId by remember { mutableStateOf("") }
    var sumInput by remember { mutableStateOf("") }
    var bulkDataInput by remember { mutableStateOf("") }
    var showBulkDialog by remember { mutableStateOf(false) }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Header
        item {
            Text(
                text = "🎲 DiceAI Native",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = DicePurple,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                textAlign = TextAlign.Center
            )
        }
        
        // Prediction Card
        item {
            PredictionCard(
                prediction = prediction,
                onGenerate = { viewModel.generatePrediction() }
            )
        }
        
        // Quick Entry Card
        item {
            QuickEntryCard(
                periodId = periodId,
                sumInput = sumInput,
                onPeriodIdChange = { periodId = it },
                onSumInputChange = { sumInput = it },
                onAddResult = {
                    val sum = sumInput.toIntOrNull()
                    if (sum != null && sum in 3..18) {
                        viewModel.addResult(periodId.ifEmpty { "-" }, sum)
                        periodId = ""
                        sumInput = ""
                    }
                }
            )
        }
        
        // Quick Add Buttons
        item {
            QuickAddButtons { sum ->
                viewModel.addResult("-", sum)
            }
        }
        
        // Bulk Import
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = DarkSurface)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text("📊 Bulk Import", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = { showBulkDialog = true },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = DicePurple)
                    ) {
                        Text("Open Bulk Import")
                    }
                }
            }
        }
        
        // Statistics Card
        item {
            StatisticsCard(statistics)
        }
        
        // History
        item {
            Text("📜 History", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }
        
        items(recentResults) { result ->
            ResultItem(result)
        }
        
        // Clear Button
        item {
            OutlinedButton(
                onClick = { viewModel.deleteAll() },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Clear All")
            }
        }
    }
    
    // Bulk Import Dialog
    if (showBulkDialog) {
        BulkImportDialog(
            bulkData = bulkDataInput,
            onBulkDataChange = { bulkDataInput = it },
            onDismiss = { showBulkDialog = false },
            onImport = {
                val results = bulkDataInput.lines().mapNotNull { line ->
                    val parts = line.split(",")
                    if (parts.size >= 2) {
                        val period = parts[0].trim()
                        val sum = parts[1].trim().toIntOrNull()
                        if (sum !=null && sum in 3..18) period to sum else null
                    } else null
                }
                viewModel.bulkInsert(results)
                bulkDataInput = ""
                showBulkDialog = false
            }
        )
    }
}

@Composable
fun PredictionCard(prediction: Prediction?, onGenerate: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("🔮 AI Prediction", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(12.dp))
            
            Text(
                text = prediction?.sum?.toString() ?: "?",
                fontSize = 64.sp,
                fontWeight = FontWeight.Black
            )
            
            if (prediction != null) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Badge(
                        containerColor = if (prediction.isBig) DiceRed else DiceBlue
                    ) {
                        Text(if (prediction.isBig) "BIG" else "SMALL", fontSize = 11.sp)
                    }
                    Badge(
                        containerColor = if (prediction.isEven) DiceGreen else DiceOrange
                    ) {
                        Text(if (prediction.isEven) "EVEN" else "ODD", fontSize = 11.sp)
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onGenerate,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = DicePurple)
            ) {
                Text("Generate Prediction")
            }
        }
    }
}

@Composable
fun QuickEntryCard(
    periodId: String,
    sumInput: String,
    onPeriodIdChange: (String) -> Unit,
    onSumInputChange: (String) -> Unit,
    onAddResult: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text("⚡ Quick Entry", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(8.dp))
            
            OutlinedTextField(
                value = periodId,
                onValueChange = onPeriodIdChange,
                label = { Text("Period ID (Optional)", fontSize = 11.sp) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            OutlinedTextField(
                value = sumInput,
                onValueChange = onSumInputChange,
                label = { Text("Sum (3-18)", fontSize = 11.sp) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Button(
                onClick = onAddResult,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = DiceGreen)
            ) {
                Text("✅ Add")
            }
        }
    }
}

@Composable
fun QuickAddButtons(onAdd: (Int) -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text("⚡ Quick Add All Numbers", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(8.dp))
            
            // Row 1: 3-6
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf(3, 4, 5, 6).forEach { sum ->
                    Button(
                        onClick = { onAdd(sum) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (sum % 2 == 0) DiceGreen.copy(alpha = 0.4f) else DiceOrange.copy(alpha = 0.4f)
                        )
                    ) {
                        Text(sum.toString(), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            
            // Row 2: 7-10
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf(7, 8, 9, 10).forEach { sum ->
                    Button(
                        onClick = { onAdd(sum) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (sum % 2 == 0) DiceGreen.copy(alpha = 0.4f) else DiceOrange.copy(alpha = 0.4f)
                        )
                    ) {
                        Text(sum.toString(), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            
            // Row 3: 11-14
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf(11, 12, 13, 14).forEach { sum ->
                    Button(
                        onClick = { onAdd(sum) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (sum % 2 == 0) DiceGreen.copy(alpha = 0.4f) else DiceOrange.copy(alpha = 0.4f)
                        )
                    ) {
                        Text(sum.toString(), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            
            // Row 4: 15-18
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf(15, 16, 17, 18).forEach { sum ->
                    Button(
                        onClick = { onAdd(sum) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (sum % 2 == 0) DiceGreen.copy(alpha = 0.4f) else DiceOrange.copy(alpha = 0.4f)
                        )
                    ) {
                        Text(sum.toString(), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun StatisticsCard(statistics: Statistics) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text("📊 Statistics", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatCard("Total", statistics.total.toString(), Modifier.weight(1f))
                StatCard("Big", statistics.bigCount.toString(), Modifier.weight(1f))
                StatCard("Small", statistics.smallCount.toString(), Modifier.weight(1f))
                StatCard("Avg", String.format("%.1f", statistics.average), Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun StatCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = DarkBackground)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Black)
            Text(label, fontSize = 9.sp)
        }
    }
}

@Composable
fun ResultItem(result: DiceResult) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(result.periodId.takeLast(8), fontSize = 10.sp)
                Text(result.sum.toString(), fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Badge(containerColor = if (result.isBig) DiceRed else DiceBlue) {
                    Text(if (result.isBig) "BIG" else "SMALL", fontSize = 9.sp)
                }
                Badge(containerColor = if (result.isEven) DiceGreen else DiceOrange) {
                    Text(if (result.isEven) "EVEN" else "ODD", fontSize = 9.sp)
                }
            }
        }
    }
}

@Composable
fun BulkImportDialog(
    bulkData: String,
    onBulkDataChange: (String) -> Unit,
    onDismiss: () -> Unit,
    onImport: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Bulk Import") },
        text = {
            OutlinedTextField(
                value = bulkData,
                onValueChange = onBulkDataChange,
                placeholder = { Text("Period,Sum\n2025...,13\n2025...,11") },
                modifier = Modifier.height(200.dp)
            )
        },
        confirmButton = {
            Button(onClick = onImport) {
                Text("Import")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
