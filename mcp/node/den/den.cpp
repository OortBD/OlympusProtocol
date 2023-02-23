#include "den.hpp"
#include <algorithm>


void mcp::den::set_max_stake(const dev::u256 &v)
{
    m_param.max_stake = v;
}

void mcp::den::set_max_reward_perday(const dev::u256 &v)
{
    m_param.max_reward_perday = v;
}

void mcp::den::witelist_add(const dev::Address &addr)
{

}

void mcp::den::witelist_remove(const dev::Address &addr)
{

}

void mcp::den::stake(const dev::Address &addr, dev::u256 &v)
{

}

void mcp::den::unstake(const dev::Address &addr, dev::u256 &v)
{

}

void mcp::den::set_cur_time(const uint32_t &time)
{
    
}

void mcp::den::handle_den_mining_event(const log_entries &log_a)
{

}

bool mcp::den::calculate_rewards(const dev::Address &addr, const uint32_t time, dev::u256 &give_rewards, dev::u256 &frozen_rewards, bool provide)
{
    if(m_dens.count(addr)){
        auto &u = m_dens[addr];
        uint32_t cur_day = time/(3600 * 24);
        if(cur_day <= u.last_calc_day){ //The call interval needs more than one day.
            return false;
        }

        static uint32_t ping_lose_time = 0;
        dev::u256 all_reward = 0;
        dev::u256 full_reward = m_param.max_reward_perday * u.stake_factor / 10000;
        bool & last_receive = u.last_receive;
        for(std::map<uint32_t, std::map<uint8_t, mining_ping>>::iterator it = u.pings.begin(); it != u.pings.end() && it->first < cur_day;){
            if(it->second.empty()){  //There is no ping on this day.
                if(last_receive){
                    if(u.online_score < 10000){
                        uint32_t score = 0;
                        for(int i=1; i<=24; i++){
                            score += std::min((uint32_t)10000, u.online_score + i*10000/168);
                        }
                        all_reward += full_reward * score / 10000;
                        u.online_score = std::min((uint32_t)10000, u.online_score + 24*10000/168);
                    }
                    else{
                        all_reward += full_reward*24;
                    }
                }
            }
            else
            {
                uint8_t hour_last = 0;
                uint8_t now;
                std::map<uint8_t, mining_ping>::iterator it2;
                for(it2=it->second.begin(), now=it2->first; now <= 24;){
                    if(last_receive){
                        if(u.online_score < 10000){
                            uint32_t score = 0;
                            for(int i=1; i<=now-hour_last; i++){
                                score += std::min((uint32_t)10000, u.online_score + i*10000/168);
                            }
                            all_reward += full_reward * score / 10000;
                            u.online_score = std::min((uint32_t)10000, u.online_score + (now-hour_last)*10000/168);
                        }
                        else{
                            all_reward += full_reward*(now-hour_last);
                        }
                    }

                    last_receive = it2->second.receive;
                    if(last_receive){
                        ping_lose_time = 0;
                    }
                    else{
                        ping_lose_time += 1;
                        if(ping_lose_time >= 2){
                            u.online_score = 0;
                        }
                    }

                    it2++;
                    hour_last = now;
                    if(it2 != it->second.end()){
                        now = it2->first;
                    }
                    else{
                        now = 24;
                    }
                }
            } 
            u.frozen[it->first] = {all_reward, all_reward * 75 / 100};
            u.cur_rewords += all_reward * 25 / 100;
            all_reward = 0;
            u.pings.erase(it++);
        }

        for(std::map<uint32_t, reward_a_day>::iterator it = u.frozen.begin(); it != u.frozen.end() && it->first < cur_day;){
            if(cur_day - it->first >= 270){
                u.cur_rewords += it->second.frozen_reward;
                u.frozen.erase(it++);
                continue;
            }
            auto give = it->second.all_reward * (cur_day-std::max(u.last_calc_day, it->first))/270;
            it->second.frozen_reward -= give;
            u.cur_rewords += give;
            frozen_rewards += it->second.frozen_reward;
            it++;
        }

        give_rewards = u.cur_rewords;
        if(provide){
            u.cur_rewords = 0;
        }
        u.last_calc_day = cur_day;
        return true;
    }
    else{
        return false;
    }
}
