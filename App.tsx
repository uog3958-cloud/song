
import React, { useState, useCallback, useEffect } from 'react';
import { getDailyRecommendations } from './services/musicService';
import { Song, RecommendationResponse } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!theme.trim()) {
      alert("음악 테마나 장르를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getDailyRecommendations(theme);
      setData(result);
    } catch (err) {
      setError("추천을 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [theme]);

  const handleReset = () => {
    setData(null);
    setTheme('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-0">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-4">
            <i className="fa-solid fa-headphones-simple text-3xl text-blue-600"></i>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Commute Harmony</h1>
          <p className="text-gray-500 font-medium">당신의 출퇴근길을 채워줄 오늘의 음악 7곡</p>
        </header>

        {/* Search Input */}
        {!data && !loading && (
          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 mb-8">
            <form onSubmit={handleRecommend} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">원하는 무드나 장르</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="예: 활기찬 월요일 아침, 비오는 날 발라드, 힙합..."
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
              >
                오늘의 리스트 추천받기
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">인공지능이 최고의 플레이리스트를 구성 중입니다...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center mb-8 border border-red-100">
            <p>{error}</p>
            <button onClick={() => handleRecommend()} className="mt-4 font-bold underline">다시 시도</button>
          </div>
        )}

        {/* Result List */}
        {data && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-4 border-b pb-4">
              <div>
                <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">TODAY'S SELECTION</span>
                <h2 className="text-2xl font-bold">{data.theme}</h2>
              </div>
              <p className="text-gray-400 text-sm font-medium">{data.date}</p>
            </div>

            <div className="space-y-4">
              {data.songs.map((song, index) => (
                <a
                  key={index}
                  href={song.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center p-5 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <div className="ml-5 flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${song.category === 'K-POP' ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                        {song.category}
                      </span>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{song.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">{song.artist}</p>
                    <p className="text-xs text-gray-400 italic line-clamp-1">"{song.reason}"</p>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-brands fa-youtube text-2xl text-red-500"></i>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-8 flex gap-4">
              <button
                onClick={() => handleRecommend()}
                className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i> 새로운 곡 추천받기
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
              >
                초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-xs">
        <p>© 2024 Commute Harmony. AI-Powered Music Discovery.</p>
      </footer>
    </div>
  );
};

export default App;
