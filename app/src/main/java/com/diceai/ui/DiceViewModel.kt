package com.diceai.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.diceai.data.DiceRepository
import com.diceai.data.DiceResult
import com.diceai.data.Statistics
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class DiceViewModel(private val repository: DiceRepository) : ViewModel() {
    
    val recentResults: StateFlow<List<DiceResult>> = repository.recentResults
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    
    private val _statistics = MutableStateFlow(Statistics(0, 0, 0, 0.0))
    val statistics: StateFlow<Statistics> = _statistics.asStateFlow()
    
    private val _prediction = MutableStateFlow<Prediction?>(null)
    val prediction: StateFlow<Prediction?> = _prediction.asStateFlow()
    
    init {
        refreshStatistics()
    }
    
    fun addResult(periodId: String, sum: Int) {
        viewModelScope.launch {
            val result = DiceResult.create(periodId, sum)
            repository.insert(result)
            refreshStatistics()
        }
    }
    
    fun bulkInsert(results: List<Pair<String, Int>>) {
        viewModelScope.launch {
            val diceResults = results.map { (periodId, sum) ->
                DiceResult.create(periodId, sum)
            }
            repository.insertAll(diceResults)
            refreshStatistics()
        }
    }
    
    fun deleteAll() {
        viewModelScope.launch {
            repository.deleteAll()
            refreshStatistics()
            _prediction.value = null
        }
    }
    
    fun generatePrediction() {
        viewModelScope.launch {
            val lastResults = repository.getLastN(20)
            if (lastResults.size < 10) {
                _prediction.value = Prediction(0, false, false, 0)
                return@launch
            }
            
            // Simple frequency-based prediction
            val sumFrequency = lastResults.groupingBy { it.sum }.eachCount()
            val predictedSum = sumFrequency.maxByOrNull { it.value }?.key ?: 0
            val confidence = ((sumFrequency[predictedSum] ?: 0) * 100 / lastResults.size).coerceAtMost(95)
            
            _prediction.value = Prediction(
                sum = predictedSum,
                isBig = predictedSum >= 11,
                isEven = predictedSum % 2 == 0,
                confidence = confidence
            )
        }
    }
    
    private fun refreshStatistics() {
        viewModelScope.launch {
            _statistics.value = repository.getStatistics()
        }
    }
}

data class Prediction(
    val sum: Int,
    val isBig: Boolean,
    val isEven: Boolean,
    val confidence: Int
)

class DiceViewModelFactory(private val repository: DiceRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DiceViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return DiceViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
