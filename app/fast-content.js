/* ============================================================
   SiteSpeak — Fast Track content
   "Power chunks": ready-to-use sentences (not isolated words).
   Learning whole chunks is the fastest route to speaking:
   you reuse the frame and swap the details.
   [level, english, arabic, frame-hint]
   ============================================================ */
window.FAST = (function () {
  const C = [
    /* ---------- A1: survival at work ---------- */
    ['A1', "I'm a mechanical engineer.", 'أنا مهندس ميكانيكا.', "I'm a/an + job"],
    ['A1', 'I work on a fit-out project in Riyadh.', 'أعمل في مشروع تشطيبات داخلية في الرياض.', 'I work on + project'],
    ['A1', 'Can you say that again, please?', 'ممكن تعيد الكلام مرة أخرى من فضلك؟', 'Can you + verb, please?'],
    ['A1', 'Can you speak more slowly, please?', 'ممكن تتكلم أبطأ من فضلك؟', 'Can you + verb, please?'],
    ['A1', 'What does this word mean?', 'ما معنى هذه الكلمة؟', 'What does X mean?'],
    ['A1', 'How do you say this in English?', 'كيف تقول هذا بالإنجليزي؟', 'How do you say…?'],
    ['A1', 'The drawings are on my desk.', 'المخططات على مكتبي.', 'X is/are on/in/under + place'],
    ['A1', 'The meeting is at ten o\'clock.', 'الاجتماع الساعة العاشرة.', 'X is at + time'],
    ['A1', 'I start work at seven in the morning.', 'أبدأ العمل الساعة السابعة صباحاً.', 'I start/finish + at time'],
    ['A1', 'Where is the site office?', 'أين مكتب الموقع؟', 'Where is the…?'],
    ['A1', 'I need the latest drawings.', 'أحتاج آخر المخططات.', 'I need + noun'],
    ['A1', 'Is the pump working?', 'هل المضخة تعمل؟', 'Is the X working?'],
    ['A1', 'There is a leak in the pipe.', 'يوجد تسريب في الماسورة.', 'There is/are + noun'],
    ['A1', 'I don\'t understand. Can you show me?', 'لا أفهم. ممكن توريني؟', "I don't + verb"],
    ['A1', 'I have a question about the ceiling.', 'عندي سؤال عن السقف.', 'I have a question about…'],
    ['A1', 'Please send me the file.', 'من فضلك أرسل لي الملف.', 'Please + verb + me + noun'],
    ['A1', 'Thank you for your help.', 'شكراً لمساعدتك.', 'Thank you for + noun/-ing'],
    ['A1', 'Sorry, I\'m late. The traffic was bad.', 'آسف على التأخير. المرور كان سيئاً.', "Sorry, I'm late."],
    ['A1', 'The workers are on the third floor.', 'العمال في الدور الثالث.', 'X are on the + floor'],
    ['A1', 'Today is very busy for me.', 'اليوم مزدحم جداً بالنسبة لي.', 'Today is + adjective'],
    ['A1', 'My phone number is in the email.', 'رقم جوالي في الإيميل.', 'My X is in the…'],
    ['A1', 'See you tomorrow at the site.', 'أشوفك بكرة في الموقع.', 'See you + time + place'],

    /* ---------- A2: daily site communication ---------- */
    ['A2', 'I checked the duct installation yesterday.', 'فحصت تركيب الدكت أمس.', 'I + past verb + yesterday'],
    ['A2', 'We finished the first fix on level 4.', 'أنهينا التمديدات الأولية في الدور الرابع.', 'We finished + noun'],
    ['A2', 'The material will arrive next week.', 'المواد ستصل الأسبوع القادم.', 'X will + verb + time'],
    ['A2', "I'm going to visit the site this afternoon.", 'سأزور الموقع بعد الظهر.', "I'm going to + verb"],
    ['A2', 'The team is installing the sprinkler pipes now.', 'الفريق يركّب مواسير الرشاشات الآن.', 'X is + verb-ing + now'],
    ['A2', 'Could you check this for me?', 'ممكن تراجع هذا لي؟', 'Could you + verb…?'],
    ['A2', 'I\'ll call you back in ten minutes.', 'سأتصل بك بعد عشر دقائق.', "I'll + verb + time"],
    ['A2', 'Who is responsible for this area?', 'من المسؤول عن هذه المنطقة؟', 'Who is responsible for…?'],
    ['A2', 'How long will it take?', 'كم سيستغرق من الوقت؟', 'How long will it take?'],
    ['A2', 'This room is bigger than the other one.', 'هذه الغرفة أكبر من الأخرى.', 'X is + -er + than Y'],
    ['A2', 'We had a problem with the supplier.', 'كانت عندنا مشكلة مع المورّد.', 'We had a problem with…'],
    ['A2', 'The inspection was postponed until Sunday.', 'تم تأجيل الفحص إلى يوم الأحد.', 'X was postponed until…'],
    ['A2', 'Please make sure the area is clean.', 'من فضلك تأكد أن المنطقة نظيفة.', 'Please make sure (that)…'],
    ['A2', 'I agree with you.', 'أتفق معك.', 'I agree with + person'],
    ['A2', "I'm not sure. Let me check.", 'لست متأكداً. دعني أتحقق.', "I'm not sure. Let me…"],
    ['A2', 'What time does the shift finish?', 'متى تنتهي الوردية؟', 'What time does X finish?'],
    ['A2', 'The contractor needs more workers.', 'المقاول يحتاج عمالة أكثر.', 'X needs more + noun'],
    ['A2', 'We have to finish before Thursday.', 'لازم ننتهي قبل الخميس.', 'We have to + verb'],
    ['A2', 'Did you receive my email?', 'هل وصلك إيميلي؟', 'Did you + verb…?'],
    ['A2', 'The chiller is on the roof.', 'التشيلر موجود على السطح.', 'X is on the roof / in the plant room'],
    ['A2', 'It usually takes two days.', 'عادةً يأخذ يومين.', 'It usually takes + time'],
    ['A2', 'I was in a meeting all morning.', 'كنت في اجتماع طوال الصباح.', 'I was in + noun + all + time'],

    /* ---------- B1: professional engineer ---------- */
    ['B1', "I've already sent the submittal to the consultant.", 'أرسلت طلب الاعتماد للاستشاري بالفعل.', "I've already + past participle"],
    ['B1', "We haven't received the approval yet.", 'لم نستلم الاعتماد حتى الآن.', "We haven't + p.p. + yet"],
    ['B1', 'The pipes must be pressure tested before closing the ceiling.', 'يجب اختبار المواسير بالضغط قبل قفل السقف.', 'X must be + p.p. + before…'],
    ['B1', 'If the material arrives on time, we will start on Monday.', 'إذا وصلت المواد في موعدها، سنبدأ يوم الاثنين.', 'If + present, will + verb'],
    ['B1', 'The work was delayed because of the late approval.', 'تأخر العمل بسبب تأخر الاعتماد.', 'X was delayed because of + noun'],
    ['B1', 'Could you please confirm the ceiling height?', 'هل يمكنك تأكيد ارتفاع السقف من فضلك؟', 'Could you please confirm…?'],
    ['B1', 'I suggest we move the duct 200 mm to the left.', 'أقترح أن نحرك الدكت 200 مم لليسار.', 'I suggest (that) we + verb'],
    ['B1', 'There is a clash between the duct and the beam.', 'يوجد تعارض بين الدكت والكمرة.', 'There is a clash between X and Y'],
    ['B1', 'We are waiting for the consultant\'s comments.', 'ننتظر ملاحظات الاستشاري.', 'We are waiting for + noun'],
    ['B1', 'The fire alarm system has been tested and commissioned.', 'تم اختبار وتشغيل نظام إنذار الحريق.', 'X has been + p.p.'],
    ['B1', 'Please find the attached inspection request.', 'تجد مرفقاً طلب الفحص.', 'Please find (the) attached + noun'],
    ['B1', 'As discussed in the meeting, we will revise the layout.', 'كما ناقشنا في الاجتماع، سنعدّل التصميم.', 'As discussed…, we will…'],
    ['B1', 'The main reason for the delay is the shortage of manpower.', 'السبب الرئيسي للتأخير هو نقص العمالة.', 'The main reason for X is Y'],
    ['B1', 'We should coordinate with the electrical team first.', 'يجب أن ننسق مع فريق الكهرباء أولاً.', 'We should + verb + first'],
    ['B1', 'Could you send me the updated schedule by tomorrow?', 'هل ترسل لي البرنامج الزمني المحدّث بحلول الغد؟', 'Could you send me X by + time?'],
    ['B1', 'According to the specifications, the pipe should be insulated.', 'حسب المواصفات، يجب عزل الماسورة.', 'According to X, …'],
    ['B1', "I'm responsible for the MEP works on this project.", 'أنا مسؤول عن أعمال الـ MEP في هذا المشروع.', "I'm responsible for + noun"],
    ['B1', 'The installation does not comply with the approved drawings.', 'التركيب غير مطابق للمخططات المعتمدة.', 'X does not comply with Y'],
    ['B1', "Let's discuss this point in the next meeting.", 'لنناقش هذه النقطة في الاجتماع القادم.', "Let's + verb + …"],
    ['B1', 'We need a decision on this as soon as possible.', 'نحتاج قراراً في هذا بأسرع وقت ممكن.', 'We need X as soon as possible'],
    ['B1', 'The site is about 80 percent complete.', 'الموقع منجز بنسبة 80٪ تقريباً.', 'X is about N percent complete'],
    ['B1', 'I have been working in construction for over ten years.', 'أعمل في المقاولات منذ أكثر من عشر سنوات.', 'I have been + -ing + for…'],
    ['B1', 'In my opinion, the second option is more practical.', 'في رأيي، الخيار الثاني عملي أكثر.', 'In my opinion, …'],
    ['B1', 'Unless we get the approval, we cannot proceed.', 'ما لم نحصل على الاعتماد، لا يمكننا المتابعة.', 'Unless + present, we cannot…'],

    /* ---------- B2: meetings, negotiation, reporting ---------- */
    ['B2', 'Just to clarify, are we talking about the low-zone or the high-zone pumps?', 'للتوضيح فقط، هل نتحدث عن مضخات المنطقة المنخفضة أم العالية؟', 'Just to clarify, are we…?'],
    ['B2', 'I see your point, but we also need to consider the cost.', 'أفهم وجهة نظرك، لكن يجب أيضاً أن نأخذ التكلفة في الاعتبار.', 'I see your point, but…'],
    ['B2', 'The contractor claims that the delay was caused by design changes.', 'يدّعي المقاول أن التأخير سببه تغييرات التصميم.', 'X claims that…'],
    ['B2', 'We would appreciate it if you could expedite the approval.', 'نكون شاكرين لو تكرمتم بتسريع الاعتماد.', 'We would appreciate it if you could…'],
    ['B2', 'It turned out that the valve had been installed in the wrong direction.', 'اتضح أن المحبس كان مركّباً في الاتجاه الخاطئ.', 'It turned out that + past perfect'],
    ['B2', 'We need to look into the root cause before we take action.', 'نحتاج أن نبحث في السبب الجذري قبل اتخاذ أي إجراء.', 'We need to look into…'],
    ['B2', 'Could we push the deadline back by one week?', 'هل يمكننا تأجيل الموعد النهائي أسبوعاً؟', 'Could we push X back by…?'],
    ['B2', 'The consultant pointed out several issues with the shop drawings.', 'أشار الاستشاري إلى عدة ملاحظات على مخططات الورشة.', 'X pointed out (that)…'],
    ['B2', 'Had we received the drawings earlier, we would have avoided the rework.', 'لو استلمنا المخططات مبكراً، لتجنبنا إعادة العمل.', 'Had we + p.p., we would have…'],
    ['B2', 'To sum up, the main risks are procurement and manpower.', 'للتلخيص، المخاطر الرئيسية هي التوريد والعمالة.', 'To sum up, …'],
    ['B2', 'I\'d like to follow up on the RFI we submitted last week.', 'أود متابعة طلب المعلومات الذي قدمناه الأسبوع الماضي.', "I'd like to follow up on…"],
    ['B2', 'The proposed alternative meets all the technical requirements.', 'البديل المقترح يحقق كل المتطلبات الفنية.', 'X meets the requirements'],
    ['B2', "That's a fair point. Let me get back to you on that.", 'نقطة منطقية. دعني أرجع لك بخصوصها.', 'Let me get back to you on that.'],
    ['B2', 'We are on track to complete the works by the end of the month.', 'نحن على المسار لإنهاء الأعمال بنهاية الشهر.', 'We are on track to…'],
    ['B2', 'The issue was escalated to the project director.', 'تم تصعيد المشكلة لمدير المشروع.', 'X was escalated to…'],
    ['B2', 'Assuming the shutdown is approved, testing will take place on Friday.', 'بافتراض اعتماد الإيقاف، سيتم الاختبار يوم الجمعة.', 'Assuming (that)…, …'],
    ['B2', 'Regarding the variation, we have submitted a detailed cost breakdown.', 'بخصوص أمر التغيير، قدمنا تفصيلاً كاملاً للتكلفة.', 'Regarding X, we have…'],
    ['B2', 'I\'m afraid we can\'t accept this without a written instruction.', 'للأسف لا يمكننا قبول هذا بدون تعليمات مكتوبة.', "I'm afraid we can't…"],
    ['B2', 'The handover depends on the civil defence inspection.', 'التسليم يعتمد على فحص الدفاع المدني.', 'X depends on Y'],
    ['B2', 'Let me walk you through the updated programme.', 'دعني أشرح لك البرنامج الزمني المحدّث خطوة بخطوة.', 'Let me walk you through…'],
    ['B2', 'We\'ve run into an unexpected problem with the existing services.', 'واجهنا مشكلة غير متوقعة مع الخدمات القائمة.', "We've run into…"],
    ['B2', 'Would it be possible to arrange a joint inspection tomorrow?', 'هل يمكن ترتيب فحص مشترك غداً؟', 'Would it be possible to…?'],

    /* ---------- C1: senior / leadership tone ---------- */
    ['C1', 'With all due respect, I don\'t think that approach is feasible within the current timeline.', 'مع كامل الاحترام، لا أعتقد أن هذا النهج ممكن ضمن الجدول الحالي.', 'With all due respect, I don\'t think…'],
    ['C1', 'It is worth noting that the specification allows for an approved equal.', 'تجدر الإشارة إلى أن المواصفات تسمح بمكافئ معتمد.', 'It is worth noting that…'],
    ['C1', 'We reserve the right to claim an extension of time.', 'نحتفظ بحقنا في المطالبة بتمديد المدة.', 'We reserve the right to…'],
    ['C1', 'On balance, the benefits clearly outweigh the additional cost.', 'إجمالاً، الفوائد تفوق التكلفة الإضافية بوضوح.', 'On balance, X outweighs Y'],
    ['C1', 'Not only did the change affect the programme, but it also increased the cost.', 'لم يؤثر التغيير على البرنامج فقط، بل زاد التكلفة أيضاً.', 'Not only did X…, but it also…'],
    ['C1', 'I would argue that the root cause lies in the coordination process.', 'أرى أن السبب الجذري يكمن في عملية التنسيق.', 'I would argue that…'],
    ['C1', 'Should you require any further information, please do not hesitate to contact me.', 'إذا احتجتم أي معلومات إضافية، لا تترددوا في التواصل معي.', 'Should you require…, please…'],
    ['C1', 'This would potentially jeopardise the handover date.', 'قد يعرّض هذا موعد التسليم للخطر.', 'This would potentially jeopardise…'],
    ['C1', 'Let\'s not lose sight of the client\'s main priority, which is safety.', 'لا يجب أن نغفل أولوية العميل الأساسية وهي السلامة.', "Let's not lose sight of…"],
    ['C1', 'Bearing in mind the long lead time, we must place the order this week.', 'مع الأخذ في الاعتبار مدة التوريد الطويلة، يجب طلب المواد هذا الأسبوع.', 'Bearing in mind X, we must…'],
    ['C1', 'The figures speak for themselves: productivity has dropped by 15 percent.', 'الأرقام تتحدث عن نفسها: انخفضت الإنتاجية 15٪.', 'The figures speak for themselves'],
    ['C1', 'I take your point; however, the contract is quite clear on this matter.', 'أتفهم وجهة نظرك، لكن العقد واضح تماماً في هذه المسألة.', 'I take your point; however, …'],
    ['C1', 'We are keen to resolve this amicably without escalating further.', 'نحرص على حل هذا ودياً دون تصعيد إضافي.', 'We are keen to…'],
    ['C1', 'Provided that the access is granted, we can mobilise within 48 hours.', 'بشرط منح التصريح، يمكننا البدء خلال 48 ساعة.', 'Provided that…, we can…'],
    ['C1', 'In hindsight, an earlier coordination workshop would have saved time.', 'بالنظر للماضي، كانت ورشة تنسيق مبكرة ستوفر الوقت.', 'In hindsight, X would have…'],
    ['C1', 'The proposal is subject to the client\'s final approval.', 'المقترح خاضع للاعتماد النهائي من العميل.', 'X is subject to Y']
  ];
  const CHUNKS = C.map((x, i) => ({ id: 'c' + i, lv: x[0], en: x[1], ar: x[2], hint: x[3] }));

  /* Daily speaking topics: each has 3 questions, from easy to harder */
  const TOPICS = [
    { lv: 'A1', t: 'About you', ar: 'عن نفسك', q: ['What is your name and what do you do?', 'Where do you work now?', 'What do you like about your job?'] },
    { lv: 'A1', t: 'Your workday', ar: 'يوم عملك', q: ['What time do you start work?', 'What do you do in the morning at work?', 'What is the hardest part of your day?'] },
    { lv: 'A1', t: 'Your office & site', ar: 'مكتبك والموقع', q: ['Describe your office.', 'What is on your desk right now?', 'Who do you work with every day?'] },
    { lv: 'A2', t: 'Yesterday at work', ar: 'أمس في العمل', q: ['What did you do at work yesterday?', 'Did you have any problems? What happened?', 'What will you do differently tomorrow?'] },
    { lv: 'A2', t: 'Your project', ar: 'مشروعك', q: ['What project are you working on?', 'What stage is the project in now?', 'When will it finish?'] },
    { lv: 'A2', t: 'A problem on site', ar: 'مشكلة في الموقع', q: ['Tell me about a problem you saw on site recently.', 'Who did you talk to about it?', 'How did you solve it?'] },
    { lv: 'A2', t: 'Weekend & free time', ar: 'العطلة ووقت الفراغ', q: ['What did you do last weekend?', 'What do you usually do after work?', 'What are your plans for next weekend?'] },
    { lv: 'B1', t: 'Your experience', ar: 'خبرتك', q: ['How long have you been working as an engineer?', 'What is the biggest project you have worked on?', 'What have you learned from it?'] },
    { lv: 'B1', t: 'Coordination', ar: 'التنسيق', q: ['How do you coordinate with other trades on site?', 'Describe a clash you found between services.', 'What would you do to avoid clashes in future?'] },
    { lv: 'B1', t: 'Approvals', ar: 'الاعتمادات', q: ['How does the material approval process work on your project?', 'What happens if a submittal is rejected?', 'How can contractors get approvals faster?'] },
    { lv: 'B1', t: 'Fire safety', ar: 'السلامة من الحريق', q: ['Explain how a sprinkler system works, simply.', 'What do civil defence inspectors usually check?', 'What is a common mistake you have seen in fire systems?'] },
    { lv: 'B1', t: 'Delays', ar: 'التأخيرات', q: ['What are the most common reasons for delays in fit-out projects?', 'Tell me about a delay you managed.', 'If you were the project manager, how would you recover the programme?'] },
    { lv: 'B2', t: 'Difficult conversation', ar: 'محادثة صعبة', q: ['Describe a time you disagreed with a consultant or client.', 'How did you handle it?', 'Looking back, what would you have done differently?'] },
    { lv: 'B2', t: 'Quality', ar: 'الجودة', q: ['How do you make sure the workmanship meets the specifications?', 'What would you do if a subcontractor kept repeating the same mistake?', 'How do you balance quality and speed?'] },
    { lv: 'B2', t: 'Job interview', ar: 'مقابلة عمل', q: ['Tell me about yourself and your career.', 'Why are you looking for a new position?', 'What value would you bring to our company?'] },
    { lv: 'B2', t: 'Technology', ar: 'التقنية', q: ['How is technology changing construction?', 'Have you used BIM or AI tools at work? How?', 'What are the risks of relying on technology?'] },
    { lv: 'C1', t: 'Leadership', ar: 'القيادة', q: ['What makes a good project manager in your opinion?', 'How do you motivate a team under pressure?', 'Describe a decision you made that was unpopular but right.'] },
    { lv: 'C1', t: 'Contracts & claims', ar: 'العقود والمطالبات', q: ['How should a contractor protect its rights when a delay happens?', 'What is the role of good documentation in claims?', 'Do you think contracts in the region are fair to contractors? Why?'] },
    { lv: 'C1', t: 'Sustainability', ar: 'الاستدامة', q: ['How can MEP design reduce energy consumption in buildings?', 'Is sustainability worth the extra cost for clients?', 'What should change in building codes to support it?'] }
  ];

  /* 90-day roadmap: three phases of 30 sprints */
  const PHASES = [
    { from: 1, to: 30, ar: 'الأساس والثقة', en: 'Foundation & confidence', goal_ar: 'تتكلم عن نفسك وعملك بجمل صحيحة بدون توقف طويل', goal_en: 'Talk about yourself and your work in correct sentences' },
    { from: 31, to: 60, ar: 'الطلاقة في العمل', en: 'Working fluency', goal_ar: 'تدير مكالمة وموقف في الموقع وتكتب إيميل واضح', goal_en: 'Handle calls, site situations and clear emails' },
    { from: 61, to: 90, ar: 'الاحتراف', en: 'Professional power', goal_ar: 'تشارك في الاجتماعات وتفاوض وتنجح في مقابلة بالإنجليزية', goal_en: 'Lead meetings, negotiate and ace interviews' }
  ];

  return { CHUNKS, TOPICS, PHASES };
})();
