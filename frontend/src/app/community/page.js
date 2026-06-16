'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { Users, Star, Award, Leaf, MessageSquare, ThumbsUp, Send, Share2, Filter } from 'lucide-react';

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Discussion state
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Ava Sterling',
      badge: 'Eco Warrior',
      content: 'Just finished my No Plastic Week challenge! Earned 150 points and feeling amazing. Refusing single-use bags is easier than I thought! 🛍️❌',
      category: 'Achievement',
      likes: 12,
      hasLiked: false,
      date: '2 hours ago',
      comments: [
        { author: 'Liam Vance', text: 'Congrats Ava! You are crushing it.' },
        { author: 'Marcus Sterling', text: 'Inspiring, I am joining that challenge tomorrow!' }
      ]
    },
    {
      id: 2,
      author: 'Liam Vance',
      badge: 'Carbon Saver',
      content: 'Quick Eco-Tip: Did you know that turning your thermostat down by just 1°C can reduce your heating bill (and footprint) by up to 10%? Give it a try! 🌡️⚡',
      category: 'Eco-Tips',
      likes: 8,
      hasLiked: false,
      date: '4 hours ago',
      comments: [
        { author: 'Chloe Mercer', text: 'Wow, simple but very effective!' }
      ]
    },
    {
      id: 3,
      author: 'Chloe Mercer',
      badge: 'Carbon Saver',
      content: 'Question: Does anyone have recommendations for high-quality, durable reusable water bottles? I want to completely phase out plastic bottles. 🥤',
      category: 'General Discussion',
      likes: 5,
      hasLiked: false,
      date: '1 day ago',
      comments: [
        { author: 'Ava Sterling', text: 'Hydro Flask or Klean Kanteen! Both last forever.' }
      ]
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General Discussion');
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" message="Loading Community..." />
      </div>
    );
  }

  if (!user) return null;

  // Mock community users to compare rank
  const leaderboard = [
    { rank: 1, name: 'Ava Sterling', points: 1420, badgesCount: 4, isMe: false },
    { rank: 2, name: 'Liam Vance', points: 950, badgesCount: 3, isMe: false },
    { rank: 3, name: 'Chloe Mercer', points: 780, badgesCount: 3, isMe: false },
    { rank: 4, name: user.name, points: user.greenPoints, badgesCount: user.badges?.length || 0, isMe: true },
    { rank: 5, name: 'Marcus Sterling', points: 280, badgesCount: 2, isMe: false },
    { rank: 6, name: 'Sienna Ross', points: 150, badgesCount: 1, isMe: false }
  ].sort((a, b) => b.points - a.points); // Sort dynamically

  // Re-map ranks after sort
  const sortedLeaderboard = leaderboard.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));

  // Handle new post submit
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: posts.length + 1,
      author: user.name,
      badge: user.badges && user.badges.length > 0 ? user.badges[user.badges.length - 1] : 'Green Beginner',
      content: newPostText,
      category: newPostCategory,
      likes: 0,
      hasLiked: false,
      date: 'Just now',
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  // Handle post like/upvote
  const handleLikePost = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked
          };
        }
        return post;
      })
    );
  };

  // Handle comment text input state
  const handleCommentTextChange = (postId, text) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: text
    });
  };

  // Handle adding a comment
  const handleAddComment = (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { author: user.name, text: commentText.trim() }]
          };
        }
        return post;
      })
    );

    setCommentInputs({
      ...commentInputs,
      [postId]: ''
    });
  };

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter((post) => post.category === activeFilter);

  const categories = ['All', 'Achievement', 'Eco-Tips', 'General Discussion'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Community Module</h2>
            <p className="text-xs text-slate-400 mt-1">Share achievements, post sustainability tips, discuss habits, and track rankings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Eco Leaderboard (col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800/80 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Eco Leaderboard</h3>
                </div>

                <div className="divide-y divide-slate-800/40">
                  {sortedLeaderboard.map((item) => {
                    let rankStyle = 'text-slate-400';
                    if (item.rank === 1) rankStyle = 'text-amber-400 text-lg font-black';
                    if (item.rank === 2) rankStyle = 'text-slate-300 text-base font-black';
                    if (item.rank === 3) rankStyle = 'text-amber-600 text-sm font-black';

                    return (
                      <div
                        key={item.name}
                        className={`flex items-center justify-between px-5 py-4 transition-colors ${
                          item.isMe
                            ? 'bg-emerald-950/20 border-y border-emerald-900/20'
                            : 'hover:bg-slate-900/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 text-center font-bold ${rankStyle}`}>
                            #{item.rank}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs sm:text-sm font-semibold ${item.isMe ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                                {item.name}
                              </span>
                              {item.isMe && (
                                <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                              <Award className="w-3.5 h-3.5" />
                              <span>{item.badgesCount} badges</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs font-bold text-emerald-400">
                          <Star className="w-3.5 h-3.5 fill-emerald-400/15" />
                          <span>{item.points} Pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips summary box */}
              <div className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border border-emerald-500/10 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Earn Green Points</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compete to log low-emission items or complete challenges. Each point pushes you up the local rank list and unlocks status badges visible to the entire community!
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Discussion Board (col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Write Post Section */}
              <form onSubmit={handleCreatePost} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Share to Community</h3>
                
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share a new sustainability tip or achievement..."
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-xs placeholder-slate-600 resize-none"
                />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Category:</span>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="General Discussion">General Discussion</option>
                      <option value="Eco-Tips">Eco-Tips</option>
                      <option value="Achievement">Achievement</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!newPostText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-md shadow-emerald-600/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              {/* Filters & Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Feed Filters</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          activeFilter === cat
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts Feed List */}
                <div className="space-y-4">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <div key={post.id} className="bg-slate-900/20 border border-slate-800/60 p-5 rounded-2xl space-y-4 hover:border-slate-800 transition-colors">
                        
                        {/* Post Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-200">{post.author}</span>
                              <span className="text-[9px] bg-slate-950 border border-slate-850 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                                {post.badge}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-600 font-semibold">{post.date}</span>
                          </div>

                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            post.category === 'Achievement'
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                              : post.category === 'Eco-Tips'
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                              : 'bg-slate-950 text-slate-400 border border-slate-850'
                          }`}>
                            {post.category}
                          </span>
                        </div>

                        {/* Content */}
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                          {post.content}
                        </p>

                        {/* Post Actions */}
                        <div className="flex items-center gap-4 pt-3 border-t border-slate-900/80 text-xs">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1.5 hover:text-slate-200 transition-colors ${
                              post.hasLiked ? 'text-emerald-400 font-bold' : 'text-slate-500'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{post.likes}</span>
                          </button>

                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{post.comments.length}</span>
                          </div>
                        </div>

                        {/* Comments section */}
                        <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                          {post.comments.length > 0 ? (
                            <div className="space-y-2.5 divide-y divide-slate-900/40 text-[11px]">
                              {post.comments.map((comment, index) => (
                                <div key={index} className="pt-2 first:pt-0">
                                  <span className="font-bold text-slate-350 mr-1.5">{comment.author}:</span>
                                  <span className="text-slate-400">{comment.text}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-600 font-medium italic">No comments yet. Be the first!</p>
                          )}

                          {/* Write Comment */}
                          <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex items-center gap-2 pt-2 border-t border-slate-900/40">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              type="submit"
                              disabled={!(commentInputs[post.id] || '').trim()}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </form>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-600 text-xs bg-slate-900/10 rounded-2xl border border-slate-850">
                      No posts found in this category. Write one above!
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
