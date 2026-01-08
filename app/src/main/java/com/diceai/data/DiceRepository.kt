package com.diceai.data

import kotlinx.coroutines.flow.Flow

class DiceRepository(private val diceDao: DiceDao) {
    
    val allResults: Flow<List<DiceResult>> = diceDao.getAllResults()
    val recentResults: Flow<List<DiceResult>> = diceDao.getRecentResults()
    
    suspend fun insert(result: DiceResult) = diceDao.insert(result)
    
    suspend fun insertAll(results: List<DiceResult>) = diceDao.insertAll(results)
    
    suspend fun delete(result: DiceResult) = diceDao.delete(result)
    
    suspend fun deleteAll() = diceDao.deleteAll()
    
    suspend fun getCount() = diceDao.getCount()
    
    suspend fun getBigCount() = diceDao.getBigCount()
    
    suspend fun getAverageSum() = diceDao.getAverageSum() ?: 0.0
    
    suspend fun getLastN(limit: Int) = diceDao.getLastN(limit)
    
    suspend fun getStatistics(): Statistics {
        val total = getCount()
        val bigCount = getBigCount()
        val avg = getAverageSum()
        
        return Statistics(
            total = total,
            bigCount = bigCount,
            smallCount = total - bigCount,
            average = avg
        )  
    }
}

data class Statistics(
    val total: Int,
    val bigCount: Int,
    val smallCount: Int,
    val average: Double
)
