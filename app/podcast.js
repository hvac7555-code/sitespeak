/* ============================================================
   SiteSpeak Podcast — original episodes for Arab MEP engineers.
   Each line: [speaker, English, Arabic]. Host and guest are read in
   different accents. Quiz: [question, options, correct index].
   Loaded after content.js, before app.js.
   ============================================================ */
window.PODCAST = {
  hosts: { H: { name: 'Sarah', voice: 'en-GB' }, G: { name: 'Guest', voice: 'en-US' } },
  episodes: [
    {
      id: 'pc1', n: 1, level: 'B1', title: 'A Day in the Life of an MEP Engineer', ar: 'يوم في حياة مهندس MEP', guest: 'Omar, Site MEP Engineer',
      lines: [
        ['H', 'Hello and welcome to the SiteSpeak Podcast. I\'m Sarah. Today my guest is Omar, an MEP engineer on a hospital project in Riyadh. Welcome, Omar!', 'أهلاً بيكم في بودكاست SiteSpeak. أنا سارة. ضيفي النهارده عمر، مهندس MEP في مشروع مستشفى في الرياض. أهلاً يا عمر!'],
        ['G', 'Thanks, Sarah. Happy to be here.', 'شكراً يا سارة. مبسوط إني هنا.'],
        ['H', 'So, what time does your day start?', 'طيب، يومك بيبدأ الساعة كام؟'],
        ['G', 'I usually arrive on site at six thirty. The first thing I do is check the daily plan with the foremen.', 'عادةً بوصل الموقع الساعة ستة ونص. أول حاجة بعملها إني أراجع خطة اليوم مع الفورمانات.'],
        ['H', 'And then?', 'وبعدين؟'],
        ['G', 'At seven we have a short toolbox talk about safety. After that, I walk around the floors and check the installation.', 'الساعة سبعة بنعمل اجتماع توعية قصير عن السلامة. بعد كده بلف على الأدوار وأتابع التركيبات.'],
        ['H', 'What do you look for when you walk around?', 'بتدوّر على إيه وانت بتلف؟'],
        ['G', 'Mostly quality and progress. For example, are the pipe supports at the right spacing? Is the ductwork sealed? Are we on schedule?', 'غالباً الجودة ونسبة الإنجاز. مثلاً: دعامات المواسير على المسافات الصح؟ الدكت متقفل كويس؟ إحنا ماشيين على الجدول؟'],
        ['H', 'Do you use English a lot during the day?', 'بتستخدم الإنجليزي كتير خلال اليوم؟'],
        ['G', 'All the time. The consultant, the main contractor and most of the documents are in English. Even with workers from different countries, English is our common language.', 'طول الوقت. الاستشاري والمقاول الرئيسي ومعظم المستندات بالإنجليزي. حتى مع العمال من بلاد مختلفة، الإنجليزي هو لغتنا المشتركة.'],
        ['H', 'What is the hardest part of your job?', 'إيه أصعب حاجة في شغلك؟'],
        ['G', 'Coordination. Every trade wants the same space in the ceiling, so we need to agree before we install anything.', 'التنسيق. كل تخصص عايز نفس المكان في السقف، فلازم نتفق قبل ما نركّب أي حاجة.'],
        ['H', 'Any advice for engineers who want to improve their English?', 'عندك نصيحة للمهندسين اللي عايزين يحسّنوا الإنجليزي؟'],
        ['G', 'Yes. Learn the phrases you need every day, and don\'t be afraid of mistakes. Speak slowly and clearly, and people will understand you.', 'أيوه. اتعلم الجمل اللي بتحتاجها كل يوم، ومتخافش من الغلط. اتكلم ببطء ووضوح، والناس هتفهمك.'],
        ['H', 'Great advice. Thank you, Omar, and thank you all for listening. See you in the next episode!', 'نصيحة ممتازة. شكراً يا عمر، وشكراً ليكم على الاستماع. نشوفكم في الحلقة الجاية!']
      ],
      words: ['foreman', 'toolbox talk', 'pipe support', 'coordination', 'on schedule'],
      q: [
        ['What time does Omar arrive on site?', ['At 6:30', 'At 7:00', 'At 8:00'], 0],
        ['What happens at seven o\'clock?', ['A design review', 'A safety toolbox talk', 'Lunch'], 1],
        ['What is the hardest part of his job?', ['Writing reports', 'Coordination between trades', 'Driving to site'], 1]
      ]
    },
    {
      id: 'pc2', n: 2, level: 'B1', title: 'How to Speak Up in Coordination Meetings', ar: 'إزاي تتكلم بثقة في اجتماعات التنسيق', guest: 'Lina, MEP Coordinator',
      lines: [
        ['H', 'Welcome back to the SiteSpeak Podcast. Today we\'re talking about meetings, and my guest is Lina, an MEP coordinator. Hi, Lina!', 'أهلاً بيكم تاني في بودكاست SiteSpeak. النهارده بنتكلم عن الاجتماعات، وضيفتي لينا، منسقة MEP. أهلاً يا لينا!'],
        ['G', 'Hi, Sarah. Thanks for having me.', 'أهلاً يا سارة. شكراً على الاستضافة.'],
        ['H', 'Many engineers stay quiet in meetings. Why do you think that happens?', 'مهندسين كتير بيسكتوا في الاجتماعات. تفتكري ليه؟'],
        ['G', 'They know the technical answer, but they worry about their English. So they wait, and the meeting moves on.', 'هما عارفين الإجابة الفنية، بس قلقانين من الإنجليزي بتاعهم. فبيستنوا، والاجتماع بيكمّل.'],
        ['H', 'So how can they join the discussion?', 'طيب إزاي يدخلوا في النقاش؟'],
        ['G', 'Use short, ready phrases. For example: "Can I add something here?" or "From the MEP side, we have a clash with the beam."', 'استخدم جمل قصيرة جاهزة. مثلاً: "ممكن أضيف حاجة هنا؟" أو "من ناحية الـ MEP، عندنا تعارض مع الكمرة."'],
        ['H', 'What if you don\'t agree with someone?', 'ولو مش موافق على كلام حد؟'],
        ['G', 'Be polite but clear. Say: "I see your point, but this will affect the ceiling height." Always give the reason.', 'كن مؤدب بس واضح. قول: "فاهم وجهة نظرك، بس ده هيأثر على ارتفاع السقف." دايماً قول السبب.'],
        ['H', 'And when you didn\'t understand something?', 'ولما متكونش فهمت حاجة؟'],
        ['G', 'Just ask: "Sorry, could you repeat that?" or "Do you mean the duct on grid line C?" Asking is professional, not weak.', 'اسأل ببساطة: "آسف، ممكن تعيد؟" أو "تقصد الدكت اللي على المحور C؟" السؤال احترافية مش ضعف.'],
        ['H', 'How should we finish a point in a meeting?', 'نقفل النقطة في الاجتماع إزاي؟'],
        ['G', 'Confirm the action: "So we will issue the revised drawing by Thursday, right?" This avoids confusion later.', 'أكّد المطلوب: "يعني هنطلّع الرسمة المعدلة يوم الخميس، صح؟" ده بيمنع اللخبطة بعدين.'],
        ['H', 'Very practical. Thank you, Lina!', 'عملي جداً. شكراً يا لينا!'],
        ['G', 'My pleasure. Good luck in your next meeting, everyone!', 'العفو. بالتوفيق في اجتماعكم الجاي يا جماعة!']
      ],
      words: ['clash', 'beam', 'ceiling height', 'grid line', 'revised drawing'],
      q: [
        ['Why do many engineers stay quiet in meetings?', ['They don\'t know the answer', 'They worry about their English', 'They are tired'], 1],
        ['What should you do when you disagree?', ['Stay quiet', 'Be polite and give the reason', 'Leave the meeting'], 1],
        ['How should you finish a point?', ['Confirm the action and the date', 'Change the subject', 'Send an email next week'], 0]
      ]
    },
    {
      id: 'pc3', n: 3, level: 'B2', title: 'Chiller Start-up Day', ar: 'يوم تشغيل التشيلر', guest: 'Khaled, Commissioning Engineer',
      lines: [
        ['H', 'Welcome to the SiteSpeak Podcast. Today\'s guest is Khaled, a commissioning engineer. Khaled, what happens on a chiller start-up day?', 'أهلاً بيكم في بودكاست SiteSpeak. ضيف النهارده خالد، مهندس تشغيل واختبار. يا خالد، إيه اللي بيحصل في يوم تشغيل التشيلر؟'],
        ['G', 'It\'s a big day! But the real work happens before it. We complete all the pre-commissioning checks first.', 'يوم كبير! بس الشغل الحقيقي بيحصل قبله. بنخلّص كل فحوصات ما قبل التشغيل الأول.'],
        ['H', 'What kind of checks?', 'فحوصات زي إيه؟'],
        ['G', 'The chilled water system must be flushed and filled, the power supply must be ready, and all valves must be in the right position.', 'شبكة المياه المبردة لازم تكون اتغسلت واتملت، والكهربا جاهزة، وكل المحابس في الوضع الصح.'],
        ['H', 'Who attends the start-up?', 'مين بيحضر التشغيل؟'],
        ['G', 'The chiller vendor, our team, and usually the consultant. The vendor\'s engineer is the one who actually starts the machine.', 'مورّد التشيلر وفريقنا، وغالباً الاستشاري. مهندس المورّد هو اللي فعلياً بيشغّل الماكينة.'],
        ['H', 'What do you measure once it\'s running?', 'بتقيسوا إيه بعد ما يشتغل؟'],
        ['G', 'Supply and return temperatures, flow rate, pressures, and the electrical current. We compare everything with the design values.', 'حرارة الدخول والخروج، ومعدل التدفق، والضغوط، والتيار الكهربائي. وبنقارن كل حاجة بالقيم التصميمية.'],
        ['H', 'And if a value is outside the range?', 'ولو قيمة طلعت برّه المدى؟'],
        ['G', 'We stop, find the cause and record it. For example, low flow often means a strainer is blocked or a valve is half closed.', 'بنوقف، ونشوف السبب، ونسجّله. مثلاً، التدفق القليل غالباً معناه إن الفلتر مسدود أو محبس نص مقفول.'],
        ['H', 'How important is the paperwork?', 'الورق مهم قد إيه؟'],
        ['G', 'Very important. If it isn\'t written on a signed test sheet, for the client it didn\'t happen.', 'مهم جداً. لو مش مكتوب على نموذج اختبار موقّع، فبالنسبة للعميل كأنه ما حصلش.'],
        ['H', 'That\'s a great rule. Thank you, Khaled!', 'قاعدة ممتازة. شكراً يا خالد!'],
        ['G', 'Thank you. And remember: preparation is ninety percent of commissioning.', 'شكراً ليكي. وافتكروا: التحضير هو تسعين في المية من التشغيل والاختبار.']
      ],
      words: ['pre-commissioning', 'flushed', 'vendor', 'supply and return temperature', 'strainer'],
      q: [
        ['What must happen before start-up day?', ['Pre-commissioning checks', 'The handover', 'The final payment'], 0],
        ['Who actually starts the chiller?', ['The consultant', 'The vendor\'s engineer', 'The client'], 1],
        ['What can low flow mean?', ['The chiller is too big', 'A blocked strainer or a half-closed valve', 'High voltage'], 1]
      ]
    },
    {
      id: 'pc4', n: 4, level: 'B2', title: 'When Things Go Wrong: NCRs', ar: 'لما الحاجة تبوظ: تقارير عدم المطابقة', guest: 'Huda, QA/QC Manager',
      lines: [
        ['H', 'Today on the SiteSpeak Podcast we\'re talking about a word nobody likes: NCR. My guest is Huda, a QA/QC manager. Welcome, Huda.', 'النهارده في بودكاست SiteSpeak بنتكلم عن كلمة محدش بيحبها: NCR. ضيفتي هدى، مديرة جودة. أهلاً يا هدى.'],
        ['G', 'Thank you. And don\'t worry, an NCR is not the end of the world!', 'شكراً. ومتقلقوش، الـ NCR مش نهاية الدنيا!'],
        ['H', 'First, what exactly is an NCR?', 'الأول، الـ NCR إيه بالظبط؟'],
        ['G', 'A non-conformance report. The consultant issues it when the work does not match the approved drawings, specifications or method statement.', 'تقرير عدم مطابقة. الاستشاري بيطلّعه لما الشغل ميكونش مطابق للرسومات أو المواصفات أو طريقة التنفيذ المعتمدة.'],
        ['H', 'What is the first thing to do when you receive one?', 'أول حاجة تعملها لما يوصلك واحد؟'],
        ['G', 'Stay calm and read it carefully. Then go to site and see the problem yourself, with photos.', 'اهدى واقراه كويس. بعدين انزل الموقع وشوف المشكلة بنفسك، وصوّرها.'],
        ['H', 'And how do you reply?', 'وبترد إزاي؟'],
        ['G', 'A good reply has three parts: the root cause, the corrective action, and the preventive action.', 'الرد الكويس فيه تلات أجزاء: السبب الجذري، والإجراء التصحيحي، والإجراء الوقائي.'],
        ['H', 'Can you give an example?', 'ممكن تدينا مثال؟'],
        ['G', 'Sure. Root cause: the insulation joints were not taped. Corrective action: re-tape all joints by Monday. Preventive action: a toolbox talk and a QC check before every inspection.', 'أكيد. السبب: وصلات العزل ماكانتش متلزقة بالشريط. التصحيح: نعيد لزق كل الوصلات يوم الاتنين. الوقاية: اجتماع توعية وفحص جودة قبل كل استلام.'],
        ['H', 'What mistakes do engineers make in their replies?', 'المهندسين بيغلطوا في إيه في ردودهم؟'],
        ['G', 'They blame someone else, or they write long stories. Be short, be honest, and give dates.', 'بيلوموا حد تاني، أو بيكتبوا حكايات طويلة. خليك مختصر وصريح، واكتب تواريخ.'],
        ['H', 'Short, honest, with dates. Thank you, Huda!', 'مختصر، صريح، وبتواريخ. شكراً يا هدى!'],
        ['G', 'You\'re welcome. Close your NCRs quickly, and your consultant will trust you more.', 'العفو. اقفلوا الـ NCR بسرعة، والاستشاري هيثق فيكم أكتر.']
      ],
      words: ['non-conformance report (NCR)', 'root cause', 'corrective action', 'preventive action', 'insulation joint'],
      q: [
        ['When is an NCR issued?', ['When work does not match the approved documents', 'When the project finishes early', 'When the client pays'], 0],
        ['What are the three parts of a good reply?', ['Price, time and scope', 'Root cause, corrective action, preventive action', 'Drawings, photos and emails'], 1],
        ['What is a common mistake in replies?', ['Giving dates', 'Being short', 'Blaming someone else'], 2]
      ]
    },
    {
      id: 'pc5', n: 5, level: 'B1', title: 'Safety First: The Toolbox Talk', ar: 'السلامة أولاً: اجتماع التوعية', guest: 'Yousef, HSE Officer',
      lines: [
        ['H', 'Welcome to the SiteSpeak Podcast. My guest today is Yousef, an HSE officer. Yousef, why is the morning toolbox talk so important?', 'أهلاً بيكم في بودكاست SiteSpeak. ضيفي النهارده يوسف، مسؤول سلامة. يا يوسف، ليه اجتماع التوعية الصبح مهم كده؟'],
        ['G', 'Because every day on site is different. The toolbox talk tells the team about today\'s hazards before they start work.', 'علشان كل يوم في الموقع مختلف. اجتماع التوعية بيعرّف الفريق بمخاطر النهارده قبل ما يبدأوا الشغل.'],
        ['H', 'How long should it be?', 'المفروض ياخد قد إيه؟'],
        ['G', 'Ten to fifteen minutes. Short and clear. If it\'s too long, people stop listening.', 'من عشرة لخمستاشر دقيقة. قصير وواضح. لو طويل، الناس بتبطّل تسمع.'],
        ['H', 'What topics do you cover?', 'بتتكلموا في مواضيع إيه؟'],
        ['G', 'Today\'s activities, for example working at height or hot works, the permits we need, and any near miss from yesterday.', 'أنشطة النهارده، زي العمل على ارتفاع أو الأعمال الساخنة، والتصاريح اللي محتاجينها، وأي حادث وشيك حصل امبارح.'],
        ['H', 'Many workers don\'t speak English well. How do you handle that?', 'عمال كتير مش بيتكلموا إنجليزي كويس. بتتعامل مع ده إزاي؟'],
        ['G', 'I use simple words and short sentences, and I show the PPE and the tools with my hands. Sometimes a foreman translates.', 'بستخدم كلمات بسيطة وجمل قصيرة، وبوري معدات الوقاية والأدوات بإيدي. وساعات فورمان بيترجم.'],
        ['H', 'Can you give us a simple sentence engineers can use?', 'ممكن تدينا جملة بسيطة يستخدمها المهندسين؟'],
        ['G', 'Of course: "Stop. This area is not safe. Wear your harness before you go up."', 'طبعاً: "استنى. المكان ده مش آمن. البس حزام الأمان قبل ما تطلع."'],
        ['H', 'And at the end of the talk?', 'وفي آخر الاجتماع؟'],
        ['G', 'Everyone signs the attendance sheet, and I ask one or two questions to check they understood.', 'الكل بيمضي على كشف الحضور، وبسأل سؤال أو اتنين علشان أتأكد إنهم فهموا.'],
        ['H', 'Thank you, Yousef. Stay safe, everyone!', 'شكراً يا يوسف. خلّوا بالكم من نفسكم يا جماعة!']
      ],
      words: ['hazard', 'permit', 'near miss', 'PPE', 'attendance sheet'],
      q: [
        ['How long should a toolbox talk be?', ['10 to 15 minutes', 'One hour', '2 minutes'], 0],
        ['What does Yousef do when workers don\'t speak English well?', ['He cancels the talk', 'He uses simple words and shows things with his hands', 'He sends an email'], 1],
        ['What happens at the end of the talk?', ['Everyone goes home', 'Everyone signs the attendance sheet', 'They have lunch'], 1]
      ]
    },
    {
      id: 'pc6', n: 6, level: 'B2', title: 'Interview Tips for MEP Engineers', ar: 'نصايح مقابلات العمل لمهندسي MEP', guest: 'Rania, Engineering Recruiter',
      lines: [
        ['H', 'Welcome to the SiteSpeak Podcast. Today we\'re talking about job interviews with Rania, a recruiter for engineering companies. Hi, Rania!', 'أهلاً بيكم في بودكاست SiteSpeak. النهارده بنتكلم عن مقابلات العمل مع رانيا، مسؤولة توظيف في شركات هندسية. أهلاً يا رانيا!'],
        ['G', 'Hi, Sarah. I love this topic!', 'أهلاً يا سارة. بحب الموضوع ده جداً!'],
        ['H', 'What is the first question in most interviews?', 'إيه أول سؤال في معظم المقابلات؟'],
        ['G', '"Tell me about yourself." Many engineers start from university. Don\'t do that. Start with your current role and your best project.', '"احكيلي عن نفسك." مهندسين كتير بيبدأوا من الجامعة. متعملش كده. ابدأ بوظيفتك الحالية وأحسن مشروع اشتغلت فيه.'],
        ['H', 'Can you give an example?', 'ممكن مثال؟'],
        ['G', '"I\'m an MEP engineer with ten years of experience. Currently, I manage the HVAC and fire fighting works on a two-hundred-bed hospital."', '"أنا مهندس MEP عندي عشر سنين خبرة. حالياً بدير أعمال التكييف ومكافحة الحريق في مستشفى مية سرير."'],
        ['H', 'That sounds strong. What about technical questions?', 'ده قوي. طيب والأسئلة الفنية؟'],
        ['G', 'Use real examples from your projects. Explain the problem, what you did, and the result. Numbers help a lot.', 'استخدم أمثلة حقيقية من مشاريعك. اشرح المشكلة، وعملت إيه، والنتيجة. الأرقام بتفرق كتير.'],
        ['H', 'What if they ask about a weakness?', 'ولو سألوا عن نقطة ضعف؟'],
        ['G', 'Be honest, and show how you are improving. For example: "My English presentations were weak, so now I practice every day."', 'كن صريح، ووضّح إزاي بتتحسن. مثلاً: "العروض بالإنجليزي كانت نقطة ضعف، فبقيت بتمرّن كل يوم."'],
        ['H', 'Any final tip?', 'نصيحة أخيرة؟'],
        ['G', 'Always prepare one or two questions for them, like: "What are the biggest challenges on this project?" It shows real interest.', 'دايماً حضّر سؤال أو اتنين ليهم، زي: "إيه أكبر تحديات المشروع ده؟" ده بيبيّن اهتمام حقيقي.'],
        ['H', 'Thank you, Rania. And good luck to everyone in their next interview!', 'شكراً يا رانيا. وبالتوفيق للكل في المقابلة الجاية!']
      ],
      words: ['current role', 'experience', 'weakness', 'challenge', 'result'],
      q: [
        ['How should you start "Tell me about yourself"?', ['With your university', 'With your current role and best project', 'With your hobbies'], 1],
        ['What helps a lot when you answer technical questions?', ['Numbers and real examples', 'Long stories', 'Speaking fast'], 0],
        ['What should you prepare at the end?', ['A question for them', 'Your salary slip', 'A joke'], 0]
      ]
    }
  ]
};
