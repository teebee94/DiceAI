package com.diceai.ui;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000R\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0016\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00020\u0019J \u0010\u001a\u001a\u00020\u00152\u0018\u0010\u001b\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\u0017\u0012\u0004\u0012\u00020\u00190\u001c0\u000fJ\u0006\u0010\u001d\u001a\u00020\u0015J\u0006\u0010\u001e\u001a\u00020\u0015J\b\u0010\u001f\u001a\u00020\u0015H\u0002R\u0016\u0010\u0005\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00070\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0014\u0010\b\u001a\b\u0012\u0004\u0012\u00020\t0\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0019\u0010\n\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00070\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\rR\u001d\u0010\u000e\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00100\u000f0\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0011\u0010\rR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\u0012\u001a\b\u0012\u0004\u0012\u00020\t0\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\r\u00a8\u0006 "}, d2 = {"Lcom/diceai/ui/DiceViewModel;", "Landroidx/lifecycle/ViewModel;", "repository", "Lcom/diceai/data/DiceRepository;", "(Lcom/diceai/data/DiceRepository;)V", "_prediction", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/diceai/ui/Prediction;", "_statistics", "Lcom/diceai/data/Statistics;", "prediction", "Lkotlinx/coroutines/flow/StateFlow;", "getPrediction", "()Lkotlinx/coroutines/flow/StateFlow;", "recentResults", "", "Lcom/diceai/data/DiceResult;", "getRecentResults", "statistics", "getStatistics", "addResult", "", "periodId", "", "sum", "", "bulkInsert", "results", "Lkotlin/Pair;", "deleteAll", "generatePrediction", "refreshStatistics", "app_debug"})
public final class DiceViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull
    private final com.diceai.data.DiceRepository repository = null;
    @org.jetbrains.annotations.NotNull
    private final kotlinx.coroutines.flow.StateFlow<java.util.List<com.diceai.data.DiceResult>> recentResults = null;
    @org.jetbrains.annotations.NotNull
    private final kotlinx.coroutines.flow.MutableStateFlow<com.diceai.data.Statistics> _statistics = null;
    @org.jetbrains.annotations.NotNull
    private final kotlinx.coroutines.flow.StateFlow<com.diceai.data.Statistics> statistics = null;
    @org.jetbrains.annotations.NotNull
    private final kotlinx.coroutines.flow.MutableStateFlow<com.diceai.ui.Prediction> _prediction = null;
    @org.jetbrains.annotations.NotNull
    private final kotlinx.coroutines.flow.StateFlow<com.diceai.ui.Prediction> prediction = null;
    
    public DiceViewModel(@org.jetbrains.annotations.NotNull
    com.diceai.data.DiceRepository repository) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final kotlinx.coroutines.flow.StateFlow<java.util.List<com.diceai.data.DiceResult>> getRecentResults() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final kotlinx.coroutines.flow.StateFlow<com.diceai.data.Statistics> getStatistics() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final kotlinx.coroutines.flow.StateFlow<com.diceai.ui.Prediction> getPrediction() {
        return null;
    }
    
    public final void addResult(@org.jetbrains.annotations.NotNull
    java.lang.String periodId, int sum) {
    }
    
    public final void bulkInsert(@org.jetbrains.annotations.NotNull
    java.util.List<kotlin.Pair<java.lang.String, java.lang.Integer>> results) {
    }
    
    public final void deleteAll() {
    }
    
    public final void generatePrediction() {
    }
    
    private final void refreshStatistics() {
    }
}