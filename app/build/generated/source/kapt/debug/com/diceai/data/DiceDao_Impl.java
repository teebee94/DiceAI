package com.diceai.data;

import android.database.Cursor;
import android.os.CancellationSignal;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.room.CoroutinesRoom;
import androidx.room.EntityDeletionOrUpdateAdapter;
import androidx.room.EntityInsertionAdapter;
import androidx.room.RoomDatabase;
import androidx.room.RoomSQLiteQuery;
import androidx.room.SharedSQLiteStatement;
import androidx.room.util.CursorUtil;
import androidx.room.util.DBUtil;
import androidx.sqlite.db.SupportSQLiteStatement;
import java.lang.Class;
import java.lang.Double;
import java.lang.Exception;
import java.lang.Integer;
import java.lang.Long;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import javax.annotation.processing.Generated;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlinx.coroutines.flow.Flow;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class DiceDao_Impl implements DiceDao {
  private final RoomDatabase __db;

  private final EntityInsertionAdapter<DiceResult> __insertionAdapterOfDiceResult;

  private final EntityDeletionOrUpdateAdapter<DiceResult> __deletionAdapterOfDiceResult;

  private final SharedSQLiteStatement __preparedStmtOfDeleteAll;

  public DiceDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertionAdapterOfDiceResult = new EntityInsertionAdapter<DiceResult>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR ABORT INTO `dice_results` (`id`,`periodId`,`sum`,`isBig`,`isEven`,`timestamp`) VALUES (nullif(?, 0),?,?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final DiceResult entity) {
        statement.bindLong(1, entity.getId());
        if (entity.getPeriodId() == null) {
          statement.bindNull(2);
        } else {
          statement.bindString(2, entity.getPeriodId());
        }
        statement.bindLong(3, entity.getSum());
        final int _tmp = entity.isBig() ? 1 : 0;
        statement.bindLong(4, _tmp);
        final int _tmp_1 = entity.isEven() ? 1 : 0;
        statement.bindLong(5, _tmp_1);
        statement.bindLong(6, entity.getTimestamp());
      }
    };
    this.__deletionAdapterOfDiceResult = new EntityDeletionOrUpdateAdapter<DiceResult>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "DELETE FROM `dice_results` WHERE `id` = ?";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final DiceResult entity) {
        statement.bindLong(1, entity.getId());
      }
    };
    this.__preparedStmtOfDeleteAll = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM dice_results";
        return _query;
      }
    };
  }

  @Override
  public Object insert(final DiceResult result, final Continuation<? super Long> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Long>() {
      @Override
      @NonNull
      public Long call() throws Exception {
        __db.beginTransaction();
        try {
          final Long _result = __insertionAdapterOfDiceResult.insertAndReturnId(result);
          __db.setTransactionSuccessful();
          return _result;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object insertAll(final List<DiceResult> results,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfDiceResult.insert(results);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object delete(final DiceResult result, final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __deletionAdapterOfDiceResult.handle(result);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object deleteAll(final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfDeleteAll.acquire();
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfDeleteAll.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Flow<List<DiceResult>> getAllResults() {
    final String _sql = "SELECT * FROM dice_results ORDER BY timestamp DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"dice_results"}, new Callable<List<DiceResult>>() {
      @Override
      @NonNull
      public List<DiceResult> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPeriodId = CursorUtil.getColumnIndexOrThrow(_cursor, "periodId");
          final int _cursorIndexOfSum = CursorUtil.getColumnIndexOrThrow(_cursor, "sum");
          final int _cursorIndexOfIsBig = CursorUtil.getColumnIndexOrThrow(_cursor, "isBig");
          final int _cursorIndexOfIsEven = CursorUtil.getColumnIndexOrThrow(_cursor, "isEven");
          final int _cursorIndexOfTimestamp = CursorUtil.getColumnIndexOrThrow(_cursor, "timestamp");
          final List<DiceResult> _result = new ArrayList<DiceResult>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final DiceResult _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPeriodId;
            if (_cursor.isNull(_cursorIndexOfPeriodId)) {
              _tmpPeriodId = null;
            } else {
              _tmpPeriodId = _cursor.getString(_cursorIndexOfPeriodId);
            }
            final int _tmpSum;
            _tmpSum = _cursor.getInt(_cursorIndexOfSum);
            final boolean _tmpIsBig;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsBig);
            _tmpIsBig = _tmp != 0;
            final boolean _tmpIsEven;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsEven);
            _tmpIsEven = _tmp_1 != 0;
            final long _tmpTimestamp;
            _tmpTimestamp = _cursor.getLong(_cursorIndexOfTimestamp);
            _item = new DiceResult(_tmpId,_tmpPeriodId,_tmpSum,_tmpIsBig,_tmpIsEven,_tmpTimestamp);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @Override
  public Flow<List<DiceResult>> getRecentResults() {
    final String _sql = "SELECT * FROM dice_results ORDER BY timestamp DESC LIMIT 50";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"dice_results"}, new Callable<List<DiceResult>>() {
      @Override
      @NonNull
      public List<DiceResult> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPeriodId = CursorUtil.getColumnIndexOrThrow(_cursor, "periodId");
          final int _cursorIndexOfSum = CursorUtil.getColumnIndexOrThrow(_cursor, "sum");
          final int _cursorIndexOfIsBig = CursorUtil.getColumnIndexOrThrow(_cursor, "isBig");
          final int _cursorIndexOfIsEven = CursorUtil.getColumnIndexOrThrow(_cursor, "isEven");
          final int _cursorIndexOfTimestamp = CursorUtil.getColumnIndexOrThrow(_cursor, "timestamp");
          final List<DiceResult> _result = new ArrayList<DiceResult>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final DiceResult _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPeriodId;
            if (_cursor.isNull(_cursorIndexOfPeriodId)) {
              _tmpPeriodId = null;
            } else {
              _tmpPeriodId = _cursor.getString(_cursorIndexOfPeriodId);
            }
            final int _tmpSum;
            _tmpSum = _cursor.getInt(_cursorIndexOfSum);
            final boolean _tmpIsBig;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsBig);
            _tmpIsBig = _tmp != 0;
            final boolean _tmpIsEven;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsEven);
            _tmpIsEven = _tmp_1 != 0;
            final long _tmpTimestamp;
            _tmpTimestamp = _cursor.getLong(_cursorIndexOfTimestamp);
            _item = new DiceResult(_tmpId,_tmpPeriodId,_tmpSum,_tmpIsBig,_tmpIsEven,_tmpTimestamp);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @Override
  public Object getCount(final Continuation<? super Integer> $completion) {
    final String _sql = "SELECT COUNT(*) FROM dice_results";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final Integer _tmp;
            if (_cursor.isNull(0)) {
              _tmp = null;
            } else {
              _tmp = _cursor.getInt(0);
            }
            _result = _tmp;
          } else {
            _result = null;
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @Override
  public Object getBigCount(final Continuation<? super Integer> $completion) {
    final String _sql = "SELECT COUNT(*) FROM dice_results WHERE isBig = 1";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final Integer _tmp;
            if (_cursor.isNull(0)) {
              _tmp = null;
            } else {
              _tmp = _cursor.getInt(0);
            }
            _result = _tmp;
          } else {
            _result = null;
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @Override
  public Object getAverageSum(final Continuation<? super Double> $completion) {
    final String _sql = "SELECT AVG(sum) FROM dice_results";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<Double>() {
      @Override
      @Nullable
      public Double call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Double _result;
          if (_cursor.moveToFirst()) {
            final Double _tmp;
            if (_cursor.isNull(0)) {
              _tmp = null;
            } else {
              _tmp = _cursor.getDouble(0);
            }
            _result = _tmp;
          } else {
            _result = null;
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @Override
  public Object getLastN(final int limit,
      final Continuation<? super List<DiceResult>> $completion) {
    final String _sql = "SELECT * FROM dice_results ORDER BY timestamp DESC LIMIT ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindLong(_argIndex, limit);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<List<DiceResult>>() {
      @Override
      @NonNull
      public List<DiceResult> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPeriodId = CursorUtil.getColumnIndexOrThrow(_cursor, "periodId");
          final int _cursorIndexOfSum = CursorUtil.getColumnIndexOrThrow(_cursor, "sum");
          final int _cursorIndexOfIsBig = CursorUtil.getColumnIndexOrThrow(_cursor, "isBig");
          final int _cursorIndexOfIsEven = CursorUtil.getColumnIndexOrThrow(_cursor, "isEven");
          final int _cursorIndexOfTimestamp = CursorUtil.getColumnIndexOrThrow(_cursor, "timestamp");
          final List<DiceResult> _result = new ArrayList<DiceResult>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final DiceResult _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPeriodId;
            if (_cursor.isNull(_cursorIndexOfPeriodId)) {
              _tmpPeriodId = null;
            } else {
              _tmpPeriodId = _cursor.getString(_cursorIndexOfPeriodId);
            }
            final int _tmpSum;
            _tmpSum = _cursor.getInt(_cursorIndexOfSum);
            final boolean _tmpIsBig;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsBig);
            _tmpIsBig = _tmp != 0;
            final boolean _tmpIsEven;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsEven);
            _tmpIsEven = _tmp_1 != 0;
            final long _tmpTimestamp;
            _tmpTimestamp = _cursor.getLong(_cursorIndexOfTimestamp);
            _item = new DiceResult(_tmpId,_tmpPeriodId,_tmpSum,_tmpIsBig,_tmpIsEven,_tmpTimestamp);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
