package com.yuyuan.wxmp.manager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

/**
 * 分布式锁管理器
 *
 * @author cq
 * @since 2025/03/19
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class DistributedLockManager {

    private final RedissonClient redissonClient;

    private final String LOCK_KEY_PREFIX = "lock:";

    /**
     * 生产者执行的方法（阻塞）
     *
     * @param lockKey  锁
     * @param supplier 生产者
     * @return {@link T}
     */
    public <T> T blockExecute(String lockKey, Supplier<T> supplier) {
        RLock lock = redissonClient.getLock(LOCK_KEY_PREFIX + lockKey);
        try {
            lock.lock();
            // 执行方法
            return supplier.get();
        } finally {
            lock.unlock();
        }
    }

    /**
     * 任务执行的方法（阻塞）
     *
     * @param lockKey  锁
     * @param runnable 任务
     */
    public void blockExecute(String lockKey, Runnable runnable) {
        RLock lock = redissonClient.getLock(LOCK_KEY_PREFIX + lockKey);
        try {
            lock.lock();
            // 执行方法
            runnable.run();
        } finally {
            lock.unlock();
        }
    }

    /**
     * 任务执行的方法（非阻塞）
     *
     * @param lockKey  锁
     * @param runnable 任务
     */
    public void nonBlockExecute(String lockKey, Runnable runnable) {
        RLock lock = redissonClient.getLock(LOCK_KEY_PREFIX + lockKey);
        if (lock.tryLock()) {
            try {
                // 执行方法
                runnable.run();
            } finally {
                lock.unlock();
            }
        }
    }

    /**
     * 生产者执行的方法（非阻塞）
     *
     * @param lockKey      锁
     * @param runSupplier  运行的生产者
     * @param elseSupplier 未获取到锁时的生产者
     */
    public <T> T nonBlockExecute(String lockKey, Supplier<T> runSupplier, Supplier<T> elseSupplier) {
        RLock lock = redissonClient.getLock(LOCK_KEY_PREFIX + lockKey);
        if (lock.tryLock()) {
            try {
                // 执行方法
                return runSupplier.get();
            } finally {
                lock.unlock();
            }
        } else {
            return elseSupplier.get();
        }
    }

}
