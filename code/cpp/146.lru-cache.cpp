#include <list>
#include <unordered_map>
#include <utility>
using namespace std;
#include <cstddef>
#include <string>
/*
 * @lc app=leetcode.cn id=146 lang=cpp
 *
 * [146] LRU Cache
 */

// @lc code=start
class LRUCache {
private:
    int capacity;
    list<pair<int, int>> accessList; // 存储键值对，访问最久的元素在尾部
    unordered_map<int, list<pair<int, int>>::iterator> cache; // 映射键到list中对应的迭代器
public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        auto it = cache.find(key);
        if (it == cache.end()) {
            return -1;
        }
        // 将该元素移动到list的头部
        accessList.splice(accessList.begin(), accessList, it->second);
        return it->second->second;
    }
    
    void put(int key, int value) {
        auto it = cache.find(key);
        if (it != cache.end()) {
            it->second->second = value;
            accessList.splice(accessList.begin(), accessList, it->second);
        } else {
            if (cache.size() == capacity) {
                int oldkey = accessList.back().first;
                accessList.pop_back();
                cache.erase(oldkey);
            }

            accessList.emplace_front(key, value);
            cache[key] = accessList.begin();
        }
    }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache* obj = new LRUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */
// @lc code=end

