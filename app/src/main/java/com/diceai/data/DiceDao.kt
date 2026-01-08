package com.diceai.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface DiceDao {
    @Query("SELECT * FROM dice_results ORDER BY timestamp DESC")
    fun getAllResults(): Flow<List<DiceResult>>
    
    @Query("SELECT * FROM dice_results ORDER BY timestamp DESC LIMIT 50")
    fun getRecentResults(): Flow<List<DiceResult>>
    
    @Query("SELECT COUNT(*) FROM dice_results")
    suspend fun getCount(): Int
    
    @Query("SELECT COUNT(*) FROM dice_results WHERE isBig = 1")
    suspend fun getBigCount(): Int
    
    @Query("SELECT AVG(sum) FROM dice_results")
    suspend fun getAverageSum(): Double?
    
    @Insert
    suspend fun insert(result: DiceResult): Long
    
    @Insert
    suspend fun insertAll(results: List<DiceResult>)
    
    @Delete
    suspend fun delete(result: DiceResult)
    
    @Query("DELETE FROM dice_results")
    suspend fun deleteAll()
    
    @Query("SELECT * FROM dice_results ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getLastN(limit: Int): List<DiceResult>
}
