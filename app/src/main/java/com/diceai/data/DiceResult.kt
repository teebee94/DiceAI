package com.diceai.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "dice_results")
data class DiceResult(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val periodId: String,
    val sum: Int,
    val isBig: Boolean,
    val isEven: Boolean,
    val timestamp: Long = System.currentTimeMillis()
) {
    companion object {
        fun create(periodId: String, sum: Int): DiceResult {
            return DiceResult(
                periodId = periodId,
                sum = sum,
                isBig = sum >= 11,
                isEven = sum % 2 == 0
            )
        }
    }
}
