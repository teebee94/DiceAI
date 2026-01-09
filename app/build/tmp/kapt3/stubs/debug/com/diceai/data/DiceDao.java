package com.diceai.data;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\u0010 \n\u0000\n\u0002\u0010\u0006\n\u0000\n\u0002\u0010\b\n\u0002\b\u0006\n\u0002\u0010\t\n\u0002\b\u0004\bg\u0018\u00002\u00020\u0001J\u0019\u0010\u0002\u001a\u00020\u00032\u0006\u0010\u0004\u001a\u00020\u0005H\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0006J\u0011\u0010\u0007\u001a\u00020\u0003H\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\bJ\u0014\u0010\t\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u000b0\nH\'J\u0013\u0010\f\u001a\u0004\u0018\u00010\rH\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\bJ\u0011\u0010\u000e\u001a\u00020\u000fH\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\bJ\u0011\u0010\u0010\u001a\u00020\u000fH\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\bJ\u001f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00050\u000b2\u0006\u0010\u0012\u001a\u00020\u000fH\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0013J\u0014\u0010\u0014\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u000b0\nH\'J\u0019\u0010\u0015\u001a\u00020\u00162\u0006\u0010\u0004\u001a\u00020\u0005H\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0006J\u001f\u0010\u0017\u001a\u00020\u00032\f\u0010\u0018\u001a\b\u0012\u0004\u0012\u00020\u00050\u000bH\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0019\u0082\u0002\u0004\n\u0002\b\u0019\u00a8\u0006\u001a"}, d2 = {"Lcom/diceai/data/DiceDao;", "", "delete", "", "result", "Lcom/diceai/data/DiceResult;", "(Lcom/diceai/data/DiceResult;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "deleteAll", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getAllResults", "Lkotlinx/coroutines/flow/Flow;", "", "getAverageSum", "", "getBigCount", "", "getCount", "getLastN", "limit", "(ILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getRecentResults", "insert", "", "insertAll", "results", "(Ljava/util/List;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
@androidx.room.Dao
public abstract interface DiceDao {
    
    @androidx.room.Query(value = "SELECT * FROM dice_results ORDER BY timestamp DESC")
    @org.jetbrains.annotations.NotNull
    public abstract kotlinx.coroutines.flow.Flow<java.util.List<com.diceai.data.DiceResult>> getAllResults();
    
    @androidx.room.Query(value = "SELECT * FROM dice_results ORDER BY timestamp DESC LIMIT 50")
    @org.jetbrains.annotations.NotNull
    public abstract kotlinx.coroutines.flow.Flow<java.util.List<com.diceai.data.DiceResult>> getRecentResults();
    
    @androidx.room.Query(value = "SELECT COUNT(*) FROM dice_results")
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object getCount(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super java.lang.Integer> $completion);
    
    @androidx.room.Query(value = "SELECT COUNT(*) FROM dice_results WHERE isBig = 1")
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object getBigCount(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super java.lang.Integer> $completion);
    
    @androidx.room.Query(value = "SELECT AVG(sum) FROM dice_results")
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object getAverageSum(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super java.lang.Double> $completion);
    
    @androidx.room.Insert
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object insert(@org.jetbrains.annotations.NotNull
    com.diceai.data.DiceResult result, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super java.lang.Long> $completion);
    
    @androidx.room.Insert
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object insertAll(@org.jetbrains.annotations.NotNull
    java.util.List<com.diceai.data.DiceResult> results, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
    
    @androidx.room.Delete
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object delete(@org.jetbrains.annotations.NotNull
    com.diceai.data.DiceResult result, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
    
    @androidx.room.Query(value = "DELETE FROM dice_results")
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object deleteAll(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
    
    @androidx.room.Query(value = "SELECT * FROM dice_results ORDER BY timestamp DESC LIMIT :limit")
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object getLastN(int limit, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super java.util.List<com.diceai.data.DiceResult>> $completion);
}