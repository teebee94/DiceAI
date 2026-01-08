package com.diceai.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [DiceResult::class], version = 1, exportSchema = false)
abstract class DiceDatabase : RoomDatabase() {
    abstract fun diceDao(): DiceDao
    
    companion object {
        @Volatile
        private var INSTANCE: DiceDatabase? = null
        
        fun getDatabase(context: Context): DiceDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DiceDatabase::class.java,
                    "dice_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
