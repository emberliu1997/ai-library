import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

export const translations = {
  en: {
    // Nav
    nav_start_here:   'Start Here',
    nav_go_deeper:    'Go Deeper',
    nav_people:       'People',
    nav_reference:    'Reference',
    nav_desc_start:   'New to AI design',
    nav_desc_deeper:  '4-stage journey',
    nav_desc_people:  'Who to follow',
    nav_desc_ref:     'Filter everything',
    nav_label:        'Navigate',
    // Sidebar
    subscribe_cta:    'Subscribe to newsletter',
    subscribe_teaser: 'Weekly reads on AI + design.',
    stay_sharp:       'Stay sharp.',
    // Start Here
    start_here_label: 'Start Here',
    start_here_h1:    'Your first 7.',
    start_here_desc:  "If you're new to designing in the AI era, start with these. Curated for the designer who wants a clear path — not a reading list.",
    why_this_one:     'Why this one',
    start_explored:   'explored',
    start_all_explored_title: '✦ All seven explored',
    start_all_explored_desc:  "You've covered the whole map. Head to Go Deeper to build real fluency — or use Reference to filter anything.",
    // Go Deeper
    go_deeper_label:  'Go Deeper',
    go_deeper_h1_all: 'The full journey.',
    go_deeper_desc:   'Four stages, built to compound. Start at Literacy and work forward — or jump to whatever you need most.',
    stage_pick:       'Stage pick',
    stage_Literacy:         'Literacy',
    stage_Craft:            'Craft',
    stage_Judgment:         'Judgment',
    stage_Systems_Thinking: 'Systems Thinking',
    framing_Literacy:         "Before you can design AI well, you need a working mental model of how it actually behaves — not the math, the psychology. What makes outputs non-deterministic? What's the difference between a model and an agent? This stage builds that foundation.",
    framing_Craft:            "Literacy tells you what AI is. Craft is about learning to shape it. Prompting, prototyping, designing the small moments that make AI feel alive — this is where reading stops and making starts.",
    framing_Judgment:         "The hardest part of building AI products isn't making them work — it's knowing whether they're working. This stage is about developing the taste, frameworks, and eval mindset to tell good from good-enough.",
    framing_Systems_Thinking: "Stage 4 is where AI stops being a feature and starts being an actor. Agents that plan, tools that hand off to humans, systems that need to be transparent and fair — this is where product design meets architecture.",
    // Type section labels
    type_videos:   'Videos',
    type_podcasts: 'Podcasts',
    type_websites: 'Websites',
    type_articles: 'Articles',
    type_books:    'Books',
    // People
    people_label:     'People I Follow',
    people_h1a:       'Follow builders,',
    people_h1b:       'not influencers.',
    people_desc:      'The people actually shipping AI — not just talking about it. Follow for the thinking process, not just the takes.',
    section_creators: 'Creators',
    section_newsletters: 'Newsletters',
    section_shows:    'Podcast Shows',
    // Reference filters
    search_placeholder: 'Search…',
    clear_all:          'Clear all',
    filter_stage:       'Stage',
    filter_format:      'Format',
    filter_time:        'Time',
    filter_topic:       'Topic',
    no_results:         'No items match these filters.',
    items_count_one:    'item',
    items_count_many:   'items',
    format_book:    'Book',
    format_video:   'Video',
    format_podcast: 'Podcast',
    format_article: 'Article',
    format_site:    'Site',
    time_15min: '15 min',
    time_1hr:   '1 hr',
    time_3hr:   '3 hr+',
    // ThinkingDrawer
    deep_thinking:      'Deep Thinking',
    why_it_matters:     'Why It Matters',
    the_connection:     'The Connection',
    close:              'Close',
    // Misc
    by:                 'by',
    view_grid:          'Grid',
    view_list:          'List',
    // Hero header
    hero_title:         "Ember's AI Learning Library",
    hero_desc:          'A collection of the best resources for learning AI and design — free to access and friendly to non-technical people.',
    hero_badge_free:    'Free to access',
    hero_badge_nontechnical: 'Non-technical friendly',
    // ThinkingDrawer CTA
    find_this_book:     'Find this book',
  },
  cn: {
    // Nav
    nav_start_here:   '从这里开始',
    nav_go_deeper:    '深入学习',
    nav_people:       '关注的人',
    nav_reference:    '参考资料',
    nav_desc_start:   'AI 设计新手入门',
    nav_desc_deeper:  '四阶段学习路径',
    nav_desc_people:  '值得关注的人',
    nav_desc_ref:     '筛选全部资源',
    nav_label:        '导航',
    // Sidebar
    subscribe_cta:    '订阅周刊',
    subscribe_teaser: 'AI 与设计的每周精选。',
    stay_sharp:       '保持敏锐。',
    // Start Here
    start_here_label: '从这里开始',
    start_here_h1:    '精选七篇。',
    start_here_desc:  '初涉 AI 时代的设计师，从这七篇开始。经过精心筛选，为你提供清晰的学习路径，而不只是一份阅读清单。',
    why_this_one:     '为什么推荐这个',
    start_explored:   '已探索',
    start_all_explored_title: '✦ 七篇全部探索完毕',
    start_all_explored_desc:  '你已覆盖完整路径。前往「深入学习」建立真正的流畅度——或使用「参考资料」筛选任何内容。',
    // Go Deeper
    go_deeper_label:  '深入学习',
    go_deeper_h1_all: '完整学习路径。',
    go_deeper_desc:   '四个阶段，层层递进。从素养阶段开始，逐步深入——或直接跳到你最需要的部分。',
    stage_pick:       '阶段精选',
    stage_Literacy:         '素养',
    stage_Craft:            '技艺',
    stage_Judgment:         '判断力',
    stage_Systems_Thinking: '系统思维',
    framing_Literacy:         '在你能够设计好 AI 产品之前，你需要对它的实际行为有一个可操作的思维模型——不是数学，而是心理学。是什么让输出具有不确定性？模型和智能体有什么不同？这个阶段建立这个基础。',
    framing_Craft:            '素养告诉你 AI 是什么。技艺是关于如何塑造它。提示词设计、原型制作、设计那些让 AI 充满活力的小时刻——这是阅读停止、创造开始的地方。',
    framing_Judgment:         '构建 AI 产品最难的不是让它运作——而是判断它是否真的在正常运作。这个阶段关乎培养品味、框架和评估思维，以区分优秀与"够用"。',
    framing_Systems_Thinking: '第四阶段，AI 不再只是一个功能，而是成为一个行动者。制定计划的智能体、移交给人类的工具、需要透明与公平的系统——产品设计在这里遇见架构。',
    // Type section labels
    type_videos:   '视频',
    type_podcasts: '播客',
    type_websites: '网站',
    type_articles: '文章',
    type_books:    '书籍',
    // People
    people_label:     '我关注的人',
    people_h1a:       '关注建造者，',
    people_h1b:       '而非影响者。',
    people_desc:      '这些人正在真正做 AI——而不仅仅是谈论它。关注他们的思考过程，而非只是他们的观点。',
    section_creators: '创作者',
    section_newsletters: '新闻订阅',
    section_shows:    '播客节目',
    // Reference filters
    search_placeholder: '搜索…',
    clear_all:          '清除全部',
    filter_stage:       '阶段',
    filter_format:      '格式',
    filter_time:        '时长',
    filter_topic:       '主题',
    no_results:         '没有符合条件的资源。',
    items_count_one:    '项',
    items_count_many:   '项',
    format_book:    '书籍',
    format_video:   '视频',
    format_podcast: '播客',
    format_article: '文章',
    format_site:    '网站',
    time_15min: '15 分钟',
    time_1hr:   '1 小时',
    time_3hr:   '3 小时+',
    // ThinkingDrawer
    deep_thinking:      '深度解读',
    why_it_matters:     '为什么重要',
    the_connection:     '核心联系',
    close:              '关闭',
    // Misc
    by:                 '作者：',
    view_grid:          '网格',
    view_list:          '列表',
    // Hero header
    hero_title:         'Ember 的 AI 学习图书馆',
    hero_desc:          '精选最优质的 AI 与设计学习资源——全部免费获取，对非技术人员友好。',
    hero_badge_free:    '全部免费',
    hero_badge_nontechnical: '非技术人员友好',
    // ThinkingDrawer CTA
    find_this_book:     '查找这本书',
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ai-lib-lang') || 'en')

  function t(key) {
    return translations[lang]?.[key] ?? translations.en[key] ?? key
  }

  function saveLang(newLang) {
    setLang(newLang)
    localStorage.setItem('ai-lib-lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: saveLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
