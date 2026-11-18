/* ============================================================
   SiteSpeak — Curriculum content
   Hand-written learning content for Arabic speakers, A1 → C2,
   plus professional, construction and MEP English.
   ============================================================ */
window.CONTENT = (function () {

  /* ---------------- CEFR levels ---------------- */
  const LEVELS = [
    { id: 'A1', name: 'Beginner', ar: 'مبتدئ', desc: 'تعرّف على نفسك، الأرقام، الأيام، الجمل البسيطة جداً.' },
    { id: 'A2', name: 'Elementary', ar: 'أساسي', desc: 'الحديث عن الروتين والماضي والخطط القريبة بجمل قصيرة.' },
    { id: 'B1', name: 'Intermediate', ar: 'متوسط', desc: 'التواصل في معظم مواقف العمل والسفر، وكتابة إيميل واضح.' },
    { id: 'B2', name: 'Upper Intermediate', ar: 'فوق المتوسط', desc: 'نقاش فني، إبداء الرأي، الاجتماعات، والتقارير.' },
    { id: 'C1', name: 'Advanced', ar: 'متقدم', desc: 'طلاقة ومرونة: التفاوض، العروض، الصياغة الاحترافية.' },
    { id: 'C2', name: 'Proficiency', ar: 'احتراف', desc: 'دقة قريبة من المتحدث الأصلي في كل السياقات.' }
  ];

  /* ---------------- Grammar lessons ----------------
     ex: [type, prompt, options|answer, correctIndex|null, explanationAr]
     type 'mc' = multiple choice, 'fill' = type the word            */
  const GRAMMAR = [
    { id: 'g-be', level: 'A1', title: 'Verb "to be": am / is / are', ar: 'فعل الكينونة',
      explain: 'في العربية نقول "أنا مهندس" بدون فعل. في الإنجليزية لازم فعل الكينونة: I am – He/She/It is – You/We/They are. النفي بإضافة not، والسؤال بتقديم الفعل.',
      rules: ['I am (I\'m) an engineer.', 'She is (she\'s) at the site.', 'They are (they\'re) in the meeting.', 'Is the pump ready? — Yes, it is.', 'We are not (aren\'t) late.'],
      ex: [
        ['mc', 'I ___ a mechanical engineer.', ['am', 'is', 'are'], 0, 'مع I نستخدم am دائماً.'],
        ['mc', 'The chiller ___ on the roof.', ['am', 'is', 'are'], 1, 'The chiller = it → is.'],
        ['mc', 'The drawings ___ ready.', ['is', 'are', 'am'], 1, 'drawings جمع → are.'],
        ['mc', '___ the consultant here?', ['Are', 'Is', 'Am'], 1, 'السؤال: نقدّم is قبل الفاعل المفرد.'],
        ['fill', 'We ___ not ready yet. (be)', 'are', null, 'We → are.']
      ] },
    { id: 'g-articles', level: 'A1', title: 'Articles: a / an / the', ar: 'أدوات التعريف والتنكير',
      explain: 'من أكثر أخطاء العرب: حذف a/an. أي اسم مفرد معدود يحتاج أداة. a قبل صوت ساكن، an قبل صوت متحرك (an engineer, an hour). the للشيء المحدد أو المعروف للطرفين أو المذكور سابقاً.',
      rules: ['I am an engineer. (ليس: I am engineer)', 'We need a new pump. The pump must be 50 m³/h.', 'an AHU (تُنطق ei) – a unit (تُنطق yu)', 'Please send the report. (تقرير معروف لنا)', 'Water is important. (لا أداة مع الاسم غير المعدود العام)'],
      ex: [
        ['mc', 'He is ___ electrical engineer.', ['a', 'an', '—'], 1, 'electrical يبدأ بصوت متحرك → an.'],
        ['mc', 'We installed ___ new FCU yesterday.', ['a', 'an', 'the'], 0, 'new يبدأ بصوت ساكن → a.'],
        ['mc', 'Please check ___ fire pump in Basement 2.', ['a', 'the', 'an'], 1, 'مضخة محددة ومعروفة → the.'],
        ['mc', 'It takes ___ hour to test the line.', ['a', 'an', 'the'], 1, 'hour تبدأ بصوت متحرك (h صامتة) → an.'],
        ['mc', 'I am ___ project manager.', ['—', 'a', 'the'], 1, 'المهنة مع اسم مفرد تحتاج a.']
      ] },
    { id: 'g-adjorder', level: 'A1', title: 'Adjective before noun', ar: 'ترتيب الصفة والموصوف',
      explain: 'في العربية: "مضخة جديدة" (الموصوف ثم الصفة). في الإنجليزية العكس: الصفة قبل الاسم: a new pump. والصفة لا تُجمع أبداً: new pumps وليس news pumps.',
      rules: ['a big project (مشروع كبير)', 'a long meeting', 'new valves (الصفة لا تُجمع)', 'a stainless steel pipe', 'the main electrical room'],
      ex: [
        ['mc', 'Choose the correct phrase:', ['a pump new', 'a new pump', 'new a pump'], 1, 'الصفة قبل الاسم.'],
        ['mc', 'Choose the correct phrase:', ['two bigs tanks', 'two big tanks', 'two tanks bigs'], 1, 'الصفة لا تُجمع وتأتي قبل الاسم.'],
        ['mc', 'Choose:', ['the room electrical', 'the electrical room', 'electrical the room'], 1, 'الأداة ثم الصفة ثم الاسم.'],
        ['mc', 'Choose:', ['a meeting important', 'an important meeting', 'a important meeting'], 1, 'important يبدأ بصوت متحرك → an، والصفة قبل الاسم.'],
        ['fill', 'Translate: "مواسير جديدة" → new ___', 'pipes', null, 'new pipes.']
      ] },
    { id: 'g-presimple', level: 'A1', title: 'Present simple', ar: 'المضارع البسيط',
      explain: 'للعادات والحقائق والجداول. مع he/she/it نضيف s للفعل. النفي: don\'t / doesn\'t + الفعل الأساسي. السؤال: Do/Does + فاعل + فعل أساسي.',
      rules: ['I start work at 7 a.m.', 'The pump runs 24 hours.', 'He doesn\'t work on Fridays.', 'Does the system need maintenance?', 'Water boils at 100 °C.'],
      ex: [
        ['mc', 'The site engineer ___ at 6:30 every day.', ['arrive', 'arrives', 'arriving'], 1, 'he/she/it → arrives.'],
        ['mc', 'We ___ work on Fridays.', ['doesn\'t', 'don\'t', 'not'], 1, 'We → don\'t.'],
        ['mc', '___ the contractor submit reports weekly?', ['Do', 'Does', 'Is'], 1, 'the contractor = he → Does.'],
        ['mc', 'She doesn\'t ___ the schedule.', ['knows', 'know', 'knowing'], 1, 'بعد doesn\'t يرجع الفعل لأصله.'],
        ['fill', 'The AHU ___ (supply) fresh air to the floor.', 'supplies', null, 'supply → supplies مع it.']
      ] },
    { id: 'g-preposition', level: 'A2', title: 'Prepositions of time & place', ar: 'حروف الجر للزمان والمكان',
      explain: 'at للوقت الدقيق والمكان المحدد (at 9 a.m., at the site). on للأيام والتواريخ والأسطح (on Monday, on the roof). in للشهور والسنين والأماكن المغلقة (in May, in the plant room).',
      rules: ['The meeting is at 10:00 on Sunday.', 'The chiller is on the roof.', 'The pumps are in the pump room.', 'We started in 2024.', 'The valve is between the pump and the tank.'],
      ex: [
        ['mc', 'The inspection is ___ Tuesday.', ['in', 'on', 'at'], 1, 'الأيام → on.'],
        ['mc', 'Let\'s meet ___ 3 p.m.', ['at', 'in', 'on'], 0, 'الساعة → at.'],
        ['mc', 'Handover is planned ___ March.', ['on', 'at', 'in'], 2, 'الشهور → in.'],
        ['mc', 'The FCU is installed ___ the false ceiling.', ['above', 'on', 'at'], 0, 'فوق السقف المستعار → above (أو in the ceiling void).'],
        ['mc', 'I\'m ___ site right now.', ['in', 'on', 'at'], 1, 'تعبير ثابت: on site (أو at the site مع the). "at site" بدون the خطأ شائع.']
      ] },
    { id: 'g-past', level: 'A2', title: 'Past simple', ar: 'الماضي البسيط',
      explain: 'لحدث انتهى في وقت محدد في الماضي. أفعال منتظمة + ed، وأفعال شاذة تُحفظ (go→went, send→sent). النفي والسؤال بـ did + فعل أساسي.',
      rules: ['We tested the line yesterday.', 'The consultant sent comments last week.', 'They didn\'t finish the ductwork.', 'Did you receive the drawings?', 'I was on site in the morning.'],
      ex: [
        ['mc', 'We ___ the pressure test yesterday.', ['do', 'did', 'done'], 1, 'yesterday → ماضي بسيط did.'],
        ['mc', 'The supplier ___ the valves last Monday.', ['deliver', 'delivered', 'delivers'], 1, 'last Monday → delivered.'],
        ['mc', 'Did you ___ the email?', ['sent', 'send', 'sending'], 1, 'بعد did الفعل في أصله.'],
        ['mc', 'They ___ finish on time.', ['didn\'t', 'don\'t', 'wasn\'t'], 0, 'نفي الماضي → didn\'t.'],
        ['fill', 'I ___ (write) the report last night.', 'wrote', null, 'write → wrote (شاذ).']
      ] },
    { id: 'g-continuous', level: 'A2', title: 'Present continuous', ar: 'المضارع المستمر',
      explain: 'لما يحدث الآن أو في هذه الفترة، ولخطط مؤكدة قريبة. am/is/are + فعل+ing.',
      rules: ['The team is installing the ducts now.', 'We are waiting for approval.', 'I\'m meeting the client tomorrow.', 'Are they working on Level 5?', 'The pump isn\'t running.'],
      ex: [
        ['mc', 'Look! The crane ___ the chiller.', ['lifts', 'is lifting', 'lifted'], 1, 'Look! → يحدث الآن.'],
        ['mc', 'We ___ for the material approval.', ['are waiting', 'waits', 'waiting'], 0, 'are + ing.'],
        ['mc', 'The pump ___ — please check it.', ['isn\'t running', 'doesn\'t running', 'not run'], 0, 'نفي المستمر: isn\'t + ing.'],
        ['mc', '___ you working on the third floor this week?', ['Do', 'Are', 'Is'], 1, 'you → Are.'],
        ['fill', 'They are ___ (test) the fire alarm now.', 'testing', null, 'test → testing.']
      ] },
    { id: 'g-future', level: 'A2', title: 'Future: will / going to', ar: 'المستقبل',
      explain: 'will للقرار اللحظي والوعد والتوقع. going to للخطة المقررة مسبقاً أو دليل واضح. في الإيميلات: We will submit... (وعد رسمي).',
      rules: ['I will send it today. (وعد)', 'We are going to start testing next week. (خطة)', 'It\'s going to rain — cover the panels.', 'Will the materials arrive on time?', 'We won\'t (will not) accept this.'],
      ex: [
        ['mc', 'Don\'t worry, I ___ call the supplier now.', ['will', 'am going to', 'going'], 0, 'قرار لحظي → will.'],
        ['mc', 'According to the schedule, we ___ start commissioning in May.', ['will to', 'are going to', 'going'], 1, 'خطة مقررة → going to.'],
        ['mc', 'We ___ accept late submissions.', ['won\'t', 'don\'t will', 'not will'], 0, 'نفي will → won\'t.'],
        ['mc', '___ the shop drawings be ready by Thursday?', ['Do', 'Will', 'Are'], 1, 'سؤال المستقبل بـ Will.'],
        ['fill', 'We are going ___ submit the MIR tomorrow.', 'to', null, 'going to + فعل.']
      ] },
    { id: 'g-compare', level: 'A2', title: 'Comparatives & superlatives', ar: 'المقارنة والتفضيل',
      explain: 'صفة قصيرة: +er / the +est (bigger, the biggest). صفة طويلة: more / the most (more efficient). شواذ: good-better-best, bad-worse-worst.',
      rules: ['Copper is more expensive than PVC.', 'This chiller is bigger than the old one.', 'VRF is the most efficient option.', 'Option B is better than Option A.', 'This is the worst delay this year.'],
      ex: [
        ['mc', 'This pump is ___ than the previous model.', ['quiet', 'quieter', 'quietest'], 1, 'مقارنة بين اثنين + than.'],
        ['mc', 'This is the ___ efficient system.', ['more', 'most', 'much'], 1, 'التفضيل: the most.'],
        ['mc', 'The new schedule is ___ than the old one.', ['gooder', 'better', 'best'], 1, 'good → better.'],
        ['mc', 'Copper pipes are ___ than PPR pipes.', ['expensiver', 'more expensive', 'most expensive'], 1, 'صفة طويلة → more.'],
        ['fill', 'Level 20 is the ___ (high) floor.', 'highest', null, 'high → the highest.']
      ] },
    { id: 'g-modals', level: 'B1', title: 'Modals: must, should, can, may, have to', ar: 'الأفعال الناقصة',
      explain: 'must إلزام قوي (الكود، السلامة). have to إلزام من الظروف. should نصيحة/توصية. can قدرة/إذن. may احتمال/إذن رسمي. بعدها فعل أساسي بدون to (عدا have to).',
      rules: ['All workers must wear PPE.', 'The contractor has to resubmit the drawings.', 'You should check the pressure gauge.', 'Can you send the BOQ?', 'May I ask a question?'],
      ex: [
        ['mc', 'Fire doors ___ remain closed. (code requirement)', ['should', 'must', 'can'], 1, 'متطلب كود → must.'],
        ['mc', 'I think you ___ add an isolation valve here.', ['must', 'should', 'may'], 1, 'نصيحة → should.'],
        ['mc', 'Sprinklers must ___ installed per NFPA 13.', ['be', 'to be', 'being'], 0, 'must + be.'],
        ['mc', '___ I have a copy of the method statement?', ['Must', 'May', 'Should'], 1, 'طلب إذن مهذب → May/Can.'],
        ['fill', 'We have ___ finish before the inspection.', 'to', null, 'have to + فعل.']
      ] },
    { id: 'g-presperfect', level: 'B1', title: 'Present perfect', ar: 'المضارع التام',
      explain: 'لحدث وقع في الماضي ونتيجته مهمة الآن، أو بدون وقت محدد. have/has + التصريف الثالث. مع already, yet, just, since, for. لا تستخدمه مع yesterday/last week.',
      rules: ['We have completed 80% of the ductwork.', 'Have you received the approval yet?', 'The consultant has just rejected the submittal.', 'I have worked in MEP for 13 years.', 'We haven\'t received payment since March.'],
      ex: [
        ['mc', 'I ___ in construction since 2013.', ['work', 'have worked', 'worked'], 1, 'since → present perfect.'],
        ['mc', '___ you sent the RFI yet?', ['Did', 'Have', 'Are'], 1, 'yet → Have.'],
        ['mc', 'We ___ the test yesterday.', ['have completed', 'completed', 'has completed'], 1, 'yesterday → ماضي بسيط وليس present perfect.'],
        ['mc', 'The client has ___ approved the variation.', ['yet', 'just', 'since'], 1, 'just = للتو.'],
        ['fill', 'The contractor has ___ (finish) the first fix.', 'finished', null, 'has + finished.']
      ] },
    { id: 'g-conditionals', level: 'B1', title: 'Conditionals 0 / 1 / 2 / 3', ar: 'جمل الشرط',
      explain: '0: حقيقة (If + مضارع، مضارع). 1: محتمل (If + مضارع، will). 2: افتراضي غير واقعي الآن (If + ماضي، would). 3: ندم على الماضي (If + had + p.p.، would have + p.p.).',
      rules: ['If the pressure drops, the jockey pump starts. (0)', 'If we receive approval today, we will start tomorrow. (1)', 'If we had more manpower, we would finish earlier. (2)', 'If they had followed the drawings, this would not have happened. (3)', 'Unless you submit it, we can\'t proceed.'],
      ex: [
        ['mc', 'If the smoke detector activates, the alarm ___.', ['sounds', 'would sound', 'sounded'], 0, 'حقيقة ثابتة → zero conditional.'],
        ['mc', 'If the material arrives on time, we ___ finish by June.', ['would', 'will', 'had'], 1, 'احتمال حقيقي → will.'],
        ['mc', 'If I ___ the budget, I would choose the VRF system.', ['have', 'had', 'will have'], 1, 'افتراض غير واقعي → had.'],
        ['mc', 'If they had tested the line, the leak ___ discovered.', ['would be', 'would have been', 'will be'], 1, 'Third conditional.'],
        ['fill', '___ you send the approval, we cannot order the equipment. (إلا إذا)', 'Unless', null, 'Unless = If not.']
      ] },
    { id: 'g-passive', level: 'B1', title: 'Passive voice', ar: 'المبني للمجهول',
      explain: 'مهم جداً في التقارير والمواصفات: نركّز على العمل لا على الفاعل. be + التصريف الثالث. Specifications: "Pipes shall be supported every 2 m."',
      rules: ['The ducts were installed last week.', 'The drawings have been approved.', 'All joints shall be tested at 1.5 × working pressure.', 'The report is being prepared.', 'The pump will be delivered on Sunday.'],
      ex: [
        ['mc', 'The fire pump ___ last month.', ['installed', 'was installed', 'is install'], 1, 'Passive past: was + p.p.'],
        ['mc', 'The submittal ___ by the consultant.', ['has been approved', 'has approved', 'approved been'], 0, 'Present perfect passive.'],
        ['mc', 'All valves shall ___ labeled.', ['be', 'been', 'being'], 0, 'shall be + p.p. (لغة المواصفات).'],
        ['mc', 'The test report ___ prepared at the moment.', ['is being', 'is been', 'being'], 0, 'Continuous passive.'],
        ['fill', 'The panels will be ___ (deliver) tomorrow.', 'delivered', null, 'will be delivered.']
      ] },
    { id: 'g-linking', level: 'B1', title: 'Linking words', ar: 'أدوات الربط',
      explain: 'لترتيب أفكارك في الاجتماعات والإيميلات: however (لكن – رسمي)، therefore (لذلك)، although (رغم أن)، due to (بسبب + اسم)، because (بسبب + جملة)، in addition (بالإضافة)، as a result (نتيجة لذلك).',
      rules: ['The material arrived late; therefore, the work was delayed.', 'Although the drawings were approved, the site conditions were different.', 'The delay was due to the late approval.', 'In addition, we need two more technicians.', 'However, the client rejected the proposal.'],
      ex: [
        ['mc', 'The work stopped ___ the heavy rain.', ['because', 'due to', 'although'], 1, 'due to + اسم.'],
        ['mc', 'The pump is expensive; ___, it is very efficient.', ['therefore', 'however', 'because'], 1, 'تناقض → however.'],
        ['mc', '___ we worked overtime, we missed the deadline.', ['Although', 'Because', 'Therefore'], 0, 'رغم أن → Although.'],
        ['mc', 'The approval was late; ___, the procurement was delayed.', ['as a result', 'although', 'despite'], 0, 'نتيجة → as a result.'],
        ['fill', 'We stopped the test ___ the pressure was dropping. (لأن)', 'because', null, 'because + جملة.']
      ] },
    { id: 'g-phrasal', level: 'B2', title: 'Phrasal verbs at work', ar: 'الأفعال المركبة',
      explain: 'المتحدثون الأصليون يستخدمونها كثيراً في الكلام. احفظها كوحدة واحدة مع مثال من الموقع.',
      rules: ['follow up (يتابع): I\'ll follow up with the supplier.', 'carry out (ينفذ): We carried out the test.', 'set up (يجهز): Set up the meeting for Monday.', 'call off (يلغي): They called off the inspection.', 'come up with (يقترح حلاً): We came up with a new routing.', 'hand over (يسلّم): We will hand over the building in June.'],
      ex: [
        ['mc', 'Please ___ the supplier about the delivery date.', ['follow up with', 'carry out', 'call off'], 0, 'follow up with = يتابع مع.'],
        ['mc', 'We ___ the hydrostatic test this morning.', ['set up', 'carried out', 'came up'], 1, 'carry out = ينفذ.'],
        ['mc', 'The client ___ the meeting because of the holiday.', ['called off', 'handed over', 'set up'], 0, 'call off = ألغى.'],
        ['mc', 'We need to ___ a solution for the clash.', ['come up with', 'hand over', 'look after'], 0, 'come up with = يبتكر/يقترح.'],
        ['fill', 'We will hand ___ the project next month.', 'over', null, 'hand over = يسلّم.']
      ] },
    { id: 'g-relative', level: 'B2', title: 'Relative clauses', ar: 'الأسماء الموصولة',
      explain: 'who للأشخاص، which للأشياء، that للاثنين (في الجمل المحدِّدة)، where للأماكن، whose للملكية. تساعدك على جمل أطول وأكثر احترافية.',
      rules: ['The engineer who approved the drawing is on leave.', 'The valve which failed was replaced.', 'This is the room where the main panel is located.', 'The contractor whose submittal was rejected must resubmit.', 'The pump that we ordered has arrived.'],
      ex: [
        ['mc', 'The technician ___ installed this valve is new.', ['which', 'who', 'where'], 1, 'شخص → who.'],
        ['mc', 'The pipe ___ is leaking must be replaced.', ['who', 'which', 'whose'], 1, 'شيء → which/that.'],
        ['mc', 'This is the shaft ___ the risers pass.', ['which', 'where', 'who'], 1, 'مكان → where.'],
        ['mc', 'The supplier ___ prices were lowest won the order.', ['who', 'whose', 'which'], 1, 'ملكية → whose.'],
        ['fill', 'The drawing ___ you sent is outdated. (that/who)', 'that', null, 'شيء → that/which.']
      ] },
    { id: 'g-reported', level: 'B2', title: 'Reported speech', ar: 'الكلام المنقول',
      explain: 'لنقل ما قيل في الاجتماع (MOM). نرجع الزمن خطوة: is→was، will→would، can→could. said (بدون مفعول) / told + شخص.',
      rules: ['"We will finish next week." → He said (that) they would finish the following week.', '"The pump is damaged." → She told me the pump was damaged.', '"Can you attend?" → He asked if I could attend.', '"Don\'t start." → The consultant told us not to start.', 'The client confirmed that the budget had been approved.'],
      ex: [
        ['mc', '"We are ready." → He said they ___ ready.', ['are', 'were', 'will be'], 1, 'are → were.'],
        ['mc', 'The consultant ___ us to stop the work.', ['said', 'told', 'asked that'], 1, 'told + شخص.'],
        ['mc', '"I will send it." → She said she ___ send it.', ['will', 'would', 'can'], 1, 'will → would.'],
        ['mc', '"Can you join?" → He asked ___ I could join.', ['that', 'if', 'what'], 1, 'سؤال yes/no → if.'],
        ['fill', 'The PM told us ___ to start before approval. (not)', 'not', null, 'told us not to + فعل.']
      ] },
    { id: 'g-advanced', level: 'C1', title: 'Hedging, inversion & formal tone', ar: 'التلطيف والصياغة الرسمية',
      explain: 'في المستوى المتقدم تحتاج للتلطيف (hedging) حتى لا تبدو حاداً: It appears that…, We would suggest…, It might be worth… والقلب (inversion) للتأكيد الرسمي: Not only…but also, Under no circumstances…',
      rules: ['It appears that the drawings have not been coordinated.', 'We would appreciate it if you could expedite the approval.', 'Not only was the material late, but it was also damaged.', 'Under no circumstances should the fire pump be isolated.', 'Should you require further information, please let us know.'],
      ex: [
        ['mc', 'Which is more diplomatic?', ['Your drawing is wrong.', 'There seems to be a discrepancy in the drawing.', 'You made a mistake.'], 1, 'Hedging يقلل الحدة.'],
        ['mc', 'Not only ___ late, but it was also incomplete.', ['the submittal was', 'was the submittal', 'the submittal is'], 1, 'Inversion بعد Not only.'],
        ['mc', '___ you require any clarification, please contact me.', ['If will', 'Should', 'Would'], 1, 'Should you = If you (رسمي).'],
        ['mc', 'Under no circumstances ___ the sprinkler valve be closed.', ['should', 'must not', 'can'], 0, 'Under no circumstances should…'],
        ['fill', 'We would ___ it if you could reply by Sunday.', 'appreciate', null, 'We would appreciate it if…']
      ] },
    { id: 'g-nuance', level: 'C2', title: 'Nuance: mixed conditionals & subjunctive', ar: 'الدقة: الشرط المختلط وصيغة الالتماس',
      explain: 'الشرط المختلط يربط الماضي بالحاضر: If we had approved it last month, we would be testing now. والـ subjunctive في العقود والمراسلات: We recommend that the contractor submit… (بدون s).',
      rules: ['If the design had been coordinated, we wouldn\'t be facing these clashes now.', 'The Engineer requires that the Contractor submit a revised programme.', 'It is essential that every joint be tested.', 'Were it not for the late payment, the works would be complete.', 'Had we known, we would have acted sooner.'],
      ex: [
        ['mc', 'If the shop drawings had been approved earlier, we ___ installing now.', ['would be', 'will be', 'would have been'], 0, 'Mixed: ماضٍ → نتيجة حاضرة.'],
        ['mc', 'We recommend that the contractor ___ a new schedule.', ['submits', 'submit', 'submitted'], 1, 'Subjunctive بعد recommend that.'],
        ['mc', '___ we known about the clash, we would have rerouted the duct.', ['If', 'Had', 'Have'], 1, 'Had we known = If we had known.'],
        ['mc', 'It is vital that the system ___ flushed before commissioning.', ['is', 'be', 'being'], 1, 'Subjunctive: be.'],
        ['fill', '___ it not for the delay, we would be finished. (Were/Was)', 'Were', null, 'Were it not for…']
      ] }
  ];

  /* ---------------- 12 tenses overview ---------------- */
  const TENSES = [
    ['Present simple', 'المضارع البسيط', 'I check the pumps every day.'],
    ['Present continuous', 'المضارع المستمر', 'I am checking the pumps now.'],
    ['Present perfect', 'المضارع التام', 'I have checked the pumps.'],
    ['Present perfect continuous', 'المضارع التام المستمر', 'I have been checking the pumps for two hours.'],
    ['Past simple', 'الماضي البسيط', 'I checked the pumps yesterday.'],
    ['Past continuous', 'الماضي المستمر', 'I was checking the pumps when the alarm rang.'],
    ['Past perfect', 'الماضي التام', 'I had checked the pumps before the inspector arrived.'],
    ['Past perfect continuous', 'الماضي التام المستمر', 'I had been checking the pumps for an hour before he arrived.'],
    ['Future simple', 'المستقبل البسيط', 'I will check the pumps tomorrow.'],
    ['Future continuous', 'المستقبل المستمر', 'I will be checking the pumps at 10 a.m.'],
    ['Future perfect', 'المستقبل التام', 'I will have checked all pumps by Thursday.'],
    ['Future perfect continuous', 'المستقبل التام المستمر', 'By noon, I will have been checking pumps for five hours.']
  ];

  /* ---------------- Vocabulary ----------------
     [english, arabic, definition (simple English), example sentence]  */
  const V = (arr, set, level) => arr.map(w => ({ en: w[0], ar: w[1], def: w[2], ex: w[3], syn: w[4] || '', ant: w[5] || '', set, level }));

  const VOCAB_SETS = [
    { id: 'daily', title: 'Daily life', ar: 'الحياة اليومية', level: 'A1', words: V([
      ['schedule', 'جدول', 'a plan of times for things', 'My schedule is busy today.', 'timetable'],
      ['appointment', 'موعد', 'an arranged time to meet', 'I have a doctor\'s appointment at 5.', 'meeting'],
      ['receipt', 'إيصال', 'paper that shows you paid', 'Can I have the receipt, please?'],
      ['change', 'الباقي / الفكة', 'money you get back', 'Keep the change.'],
      ['reservation', 'حجز', 'a booking for a table, room or seat', 'I have a reservation for two.', 'booking'],
      ['luggage', 'أمتعة', 'bags for travel', 'My luggage is too heavy.', 'baggage'],
      ['delay', 'تأخير', 'when something happens later than planned', 'There is a delay of one hour.', 'hold-up'],
      ['available', 'متاح', 'free to use or to meet', 'Are you available tomorrow?', 'free', 'busy'],
      ['expensive', 'غالٍ', 'costs a lot of money', 'This hotel is expensive.', 'costly', 'cheap'],
      ['neighborhood', 'حي', 'the area where you live', 'My neighborhood is quiet.', 'area'],
      ['prescription', 'وصفة طبية', 'a doctor\'s note for medicine', 'I need this prescription filled.'],
      ['traffic', 'زحمة مرور', 'cars on the road', 'Traffic is heavy on King Fahd Road.'],
      ['invite', 'يدعو', 'ask someone to come', 'I want to invite you to dinner.'],
      ['borrow', 'يستعير', 'take something and return it later', 'Can I borrow your pen?', '', 'lend'],
      ['refund', 'استرداد المال', 'money given back', 'I want a refund for this item.'],
      ['directions', 'الاتجاهات', 'how to go to a place', 'Can you give me directions to the station?'],
      ['comfortable', 'مريح', 'pleasant and relaxed', 'This chair is comfortable.', '', 'uncomfortable'],
      ['quickly', 'بسرعة', 'fast', 'Please reply quickly.', 'fast', 'slowly'],
      ['weekend', 'عطلة نهاية الأسبوع', 'Friday and Saturday in Saudi Arabia', 'What did you do at the weekend?'],
      ['bill', 'فاتورة', 'paper showing how much to pay', 'Could we have the bill, please?', 'check']
    ], 'daily', 'A1') },
    { id: 'work', title: 'Workplace', ar: 'بيئة العمل', level: 'A2', words: V([
      ['deadline', 'موعد نهائي', 'the last time to finish something', 'The deadline is next Thursday.', 'due date'],
      ['colleague', 'زميل', 'a person you work with', 'My colleague will join the call.', 'coworker'],
      ['responsible for', 'مسؤول عن', 'having the duty to do something', 'I am responsible for the MEP works.', 'in charge of'],
      ['attend', 'يحضر', 'go to a meeting or event', 'Please attend the meeting at 10.', 'join', 'miss'],
      ['postpone', 'يؤجل', 'move to a later time', 'They postponed the inspection.', 'delay', 'bring forward'],
      ['approve', 'يعتمد / يوافق', 'officially accept', 'The consultant approved the drawings.', 'accept', 'reject'],
      ['reject', 'يرفض', 'not accept', 'The client rejected the proposal.', 'refuse', 'approve'],
      ['priority', 'أولوية', 'the most important thing', 'Safety is our first priority.'],
      ['update', 'تحديث / يحدّث', 'new information', 'Can you give me an update?'],
      ['feedback', 'ملاحظات / رأي', 'comments about work', 'Thanks for your feedback.', 'comments'],
      ['issue', 'مشكلة / يصدر', 'a problem; or to officially send', 'We have an issue with the supply.', 'problem'],
      ['confirm', 'يؤكد', 'say that something is true or fixed', 'Please confirm the meeting time.', 'verify'],
      ['agenda', 'جدول أعمال', 'list of topics for a meeting', 'Let\'s go through the agenda.'],
      ['task', 'مهمة', 'a piece of work', 'This task will take two days.', 'assignment'],
      ['experience', 'خبرة', 'knowledge from doing a job', 'I have 13 years of experience in MEP.'],
      ['skill', 'مهارة', 'ability to do something well', 'Communication is an important skill.'],
      ['salary', 'راتب', 'money paid monthly for work', 'The salary is paid at the end of the month.'],
      ['promotion', 'ترقية', 'moving to a higher job', 'He got a promotion last year.'],
      ['resign', 'يستقيل', 'leave a job by choice', 'She resigned last month.', 'quit'],
      ['handover', 'تسليم', 'giving the finished work to the owner', 'The handover is planned for June.']
    ], 'work', 'A2') },
    { id: 'hvac', title: 'HVAC', ar: 'التكييف والتهوية', level: 'B1', words: V([
      ['chiller', 'تشيلر / مبرد مياه', 'machine that cools water for air conditioning', 'The chiller supplies chilled water at 6 °C.'],
      ['chilled water', 'مياه مبردة', 'cold water used to cool air', 'Check the chilled water supply temperature.'],
      ['AHU (air handling unit)', 'وحدة مناولة الهواء', 'large unit that conditions and moves air', 'The AHU serves floors 1 to 5.'],
      ['FCU (fan coil unit)', 'وحدة ملف المروحة', 'small unit with a fan and coil for one space', 'Each office has a ceiling-concealed FCU.'],
      ['ductwork', 'مجاري الهواء', 'system of ducts that carry air', 'The ductwork must be insulated.'],
      ['diffuser', 'ناشر هواء', 'outlet that spreads supply air', 'Install the diffusers per the reflected ceiling plan.'],
      ['return air grille', 'شبكة هواء راجع', 'opening that takes air back to the unit', 'The return air grille is blocked.'],
      ['damper', 'مخمد / دامبر', 'blade that controls air flow', 'Close the volume damper by 30%.'],
      ['fire damper', 'دامبر حريق', 'damper that closes in a fire', 'Fire dampers are required at fire-rated walls.'],
      ['VAV box', 'صندوق حجم هواء متغير', 'controls air volume to a zone', 'The VAV box modulates the airflow.'],
      ['fresh air', 'هواء نقي', 'outside air brought into the building', 'The FAHU treats fresh air.', 'outdoor air'],
      ['exhaust fan', 'مروحة طرد', 'fan that removes air', 'The toilet exhaust fan is not working.'],
      ['cooling load', 'حمل التبريد', 'amount of heat to remove', 'We calculated the cooling load at 450 TR.'],
      ['ton of refrigeration (TR)', 'طن تبريد', 'unit of cooling = 3.517 kW', 'The chiller capacity is 500 TR.'],
      ['refrigerant', 'وسيط التبريد / الفريون', 'fluid in the cooling cycle', 'The system uses R-410A refrigerant.'],
      ['condensate drain', 'تصريف المياه المتكثفة', 'pipe that removes water from the coil', 'The condensate drain needs a trap.'],
      ['insulation', 'عزل', 'material that stops heat transfer', 'The duct insulation is damaged.'],
      ['static pressure', 'الضغط الاستاتيكي', 'pressure in a duct against the walls', 'The fan static pressure is 500 Pa.'],
      ['testing and balancing (TAB)', 'الاختبار والموازنة', 'measuring and adjusting air/water flow', 'TAB will start after the system is complete.'],
      ['smoke extract', 'سحب الدخان', 'removing smoke during fire', 'The smoke extract fans are on the roof.'],
      ['stair pressurization', 'ضغط السلالم', 'keeping smoke out of stairs with air pressure', 'Stair pressurization fans start on fire alarm.'],
      ['thermostat', 'ثرموستات', 'device to set and control temperature', 'Set the thermostat to 23 °C.'],
      ['VRF', 'نظام تدفق وسيط تبريد متغير', 'multi-split system with variable refrigerant flow', 'A VRF system was selected for the villa.'],
      ['cooling tower', 'برج تبريد', 'rejects heat from condenser water to air', 'Clean the cooling tower basin monthly.'],
      ['BMS', 'نظام إدارة المبنى', 'computer control of building systems', 'The AHUs are monitored by the BMS.']
    ], 'hvac', 'B1') },
    { id: 'fire', title: 'Fire fighting & alarm', ar: 'مكافحة وإنذار الحريق', level: 'B1', words: V([
      ['fire pump', 'مضخة حريق', 'main pump that supplies water for fire fighting', 'The electric fire pump is rated 750 GPM.'],
      ['jockey pump', 'مضخة الضغط (جوكي)', 'small pump that keeps system pressure', 'The jockey pump starts at 7 bar.'],
      ['diesel fire pump', 'مضخة حريق ديزل', 'backup fire pump driven by a diesel engine', 'The diesel fire pump runs weekly.'],
      ['sprinkler', 'رشاش', 'head that sprays water when heated', 'Sprinkler heads must be 100 mm below the ceiling.'],
      ['pendent sprinkler', 'رشاش متدلٍّ', 'sprinkler pointing down', 'Install pendent sprinklers in the false ceiling.'],
      ['upright sprinkler', 'رشاش قائم', 'sprinkler pointing up', 'Upright sprinklers are used in the parking.'],
      ['fire hose cabinet (FHC)', 'كابينة خرطوم حريق', 'cabinet with hose reel and valve', 'Each FHC must be accessible.'],
      ['landing valve', 'صمام الهبوط', 'valve for fire brigade hoses', 'Landing valves are in the stair lobby.'],
      ['fire department connection (FDC)', 'وصلة الدفاع المدني', 'inlet for fire truck water', 'The FDC is at the building entrance.', 'Siamese connection'],
      ['alarm check valve', 'صمام إنذار', 'valve that signals water flow', 'The alarm check valve is in the valve room.'],
      ['flow switch', 'مفتاح تدفق', 'detects water flow in a pipe', 'The flow switch sends a signal to the panel.'],
      ['tamper switch', 'مفتاح عبث', 'signals if a valve is closed', 'Each control valve has a tamper switch.'],
      ['zone control valve', 'صمام التحكم بالمنطقة', 'valve assembly for one floor or zone', 'Install a zone control valve on each floor.'],
      ['smoke detector', 'كاشف دخان', 'device that senses smoke', 'Smoke detectors are required in corridors.'],
      ['heat detector', 'كاشف حرارة', 'device that senses high temperature', 'Use heat detectors in the kitchen.'],
      ['manual call point', 'نقطة إنذار يدوية', 'button people press in fire', 'Manual call points are at every exit.', 'break glass'],
      ['fire alarm control panel (FACP)', 'لوحة التحكم بالإنذار', 'main panel of the alarm system', 'The FACP is in the security room.'],
      ['sounder / strobe', 'جرس / وماض', 'device giving sound and light alarm', 'Sounders must be audible in all areas.'],
      ['FM-200', 'نظام إطفاء بالغاز', 'clean agent gas system', 'The server room has an FM-200 system.', 'clean agent'],
      ['hydrostatic test', 'اختبار الضغط الهيدروستاتيكي', 'water pressure test of pipes', 'The hydrostatic test is 200 psi for 2 hours.'],
      ['fire rating', 'تصنيف مقاومة الحريق', 'how long a part resists fire', 'This wall has a 2-hour fire rating.'],
      ['civil defense', 'الدفاع المدني', 'authority for fire safety approval', 'We need civil defense approval before occupancy.'],
      ['firestopping', 'سد فتحات الحريق', 'sealing openings in fire-rated walls', 'Firestopping is required around all penetrations.'],
      ['hydrant', 'حنفية حريق', 'outdoor fire water outlet', 'The fire hydrant is 30 m from the building.'],
      ['NFPA', 'الجمعية الوطنية للحماية من الحرائق', 'US fire protection standards body', 'The design follows NFPA 13 and NFPA 20.']
    ], 'fire', 'B1') },
    { id: 'plumbing', title: 'Plumbing & drainage', ar: 'التغذية والصرف الصحي', level: 'B1', words: V([
      ['water supply', 'تغذية المياه', 'system that brings clean water', 'The water supply comes from the roof tank.'],
      ['booster pump', 'مضخة رفع الضغط', 'pump that increases water pressure', 'The booster pump set has three pumps.'],
      ['water tank', 'خزان مياه', 'container for storing water', 'The ground tank holds 200 m³.'],
      ['riser', 'صاعد', 'vertical pipe between floors', 'The water riser is in shaft S2.'],
      ['drainage', 'الصرف', 'system that removes waste water', 'Drainage pipes need a slope of 1–2%.'],
      ['soil pipe', 'ماسورة الصرف (السوداء)', 'pipe for toilet waste', 'The soil pipe connects to the manhole.'],
      ['waste pipe', 'ماسورة المياه الرمادية', 'pipe for sink and shower water', 'The waste pipe is 50 mm.'],
      ['vent pipe', 'ماسورة التهوية', 'pipe that lets air into drains', 'Every stack needs a vent pipe.'],
      ['floor drain', 'صفاية أرضية', 'drain in the floor', 'Install a floor drain in each bathroom.'],
      ['P-trap', 'سيفون', 'U-shaped pipe that holds water to block smells', 'The P-trap prevents bad smells.'],
      ['cleanout', 'فتحة تنظيف', 'access point to clean pipes', 'Provide a cleanout at each change of direction.'],
      ['manhole', 'غرفة تفتيش', 'underground chamber to access drains', 'The manhole cover is broken.', 'inspection chamber'],
      ['gradient / slope', 'ميل', 'how much a pipe goes down', 'The gradient is 1:100.', 'fall'],
      ['gate valve', 'محبس بوابة', 'valve for full open/close', 'Close the gate valve before maintenance.'],
      ['check valve', 'صمام عدم رجوع', 'valve that allows flow one way', 'A check valve is installed after the pump.', 'non-return valve'],
      ['pressure reducing valve (PRV)', 'صمام تخفيض الضغط', 'valve that lowers pressure', 'PRVs are needed on lower floors.'],
      ['water heater', 'سخان مياه', 'device that heats water', 'Each apartment has a 50 L water heater.'],
      ['leak', 'تسريب', 'water escaping from a pipe', 'There is a leak at the joint.'],
      ['PPR pipe', 'مواسير بي بي آر', 'plastic pipe for hot and cold water', 'PPR pipes are joined by heat fusion.'],
      ['uPVC pipe', 'مواسير يو بي في سي', 'rigid plastic pipe for drainage', 'uPVC is used for the soil stacks.'],
      ['lifting station', 'محطة رفع', 'pumps sewage up to a higher level', 'The basement has a sewage lifting station.', 'sump pit'],
      ['grease trap', 'مصيدة الشحوم', 'separates grease from kitchen water', 'The kitchen needs a grease trap.'],
      ['fixture unit', 'وحدة التجهيزات', 'value used to size pipes', 'We sized the stack by fixture units.'],
      ['flushing', 'غسيل المواسير', 'cleaning pipes with water flow', 'Flushing is done before disinfection.'],
      ['disinfection', 'تعقيم', 'killing bacteria with chlorine', 'Disinfection of the water tank is required.']
    ], 'plumbing', 'B1') },
    { id: 'electrical', title: 'Electrical', ar: 'الكهرباء', level: 'B1', words: V([
      ['main distribution board (MDB)', 'لوحة التوزيع الرئيسية', 'main electrical panel', 'The MDB is in the electrical room.'],
      ['sub-main distribution board (SMDB)', 'لوحة توزيع فرعية رئيسية', 'panel feeding a floor or zone', 'Each floor has an SMDB.'],
      ['circuit breaker', 'قاطع', 'device that stops current on fault', 'The circuit breaker tripped.'],
      ['cable tray', 'حامل كابلات', 'support for cables', 'The cable tray runs above the corridor.'],
      ['conduit', 'ماسورة كهرباء', 'tube that protects wires', 'Use PVC conduit in the slab.'],
      ['earthing / grounding', 'التأريض', 'connecting to earth for safety', 'Earthing resistance must be below 1 ohm.'],
      ['lighting fixture', 'وحدة إنارة', 'light fitting', 'Install LED lighting fixtures in offices.', 'luminaire'],
      ['transformer', 'محول', 'changes voltage level', 'The transformer is 1500 kVA.'],
      ['generator', 'مولد', 'produces backup power', 'The generator supplies the fire pump.'],
      ['ATS (automatic transfer switch)', 'مفتاح التحويل الأوتوماتيكي', 'switches between normal and backup power', 'The ATS transfers within 10 seconds.'],
      ['load schedule', 'جدول الأحمال', 'list of loads on a panel', 'Update the load schedule for the new FCUs.'],
      ['megger test', 'اختبار عزل الكابلات', 'insulation resistance test', 'The megger test results are acceptable.', 'insulation resistance test'],
      ['short circuit', 'قصر', 'fault with very high current', 'A short circuit damaged the cable.'],
      ['voltage drop', 'هبوط الجهد', 'loss of voltage along a cable', 'The voltage drop must not exceed 4%.'],
      ['emergency lighting', 'إنارة الطوارئ', 'lights that work during power failure', 'Emergency lighting is required on escape routes.'],
      ['socket outlet', 'بريزة', 'point to plug devices', 'Add two socket outlets near the desk.', 'power outlet'],
      ['busbar / busway', 'قضبان التوزيع', 'metal bar system for high current', 'The busway feeds the upper floors.'],
      ['UPS', 'مصدر طاقة غير منقطع', 'battery backup for critical loads', 'The server room is on UPS.'],
      ['lightning protection', 'الحماية من الصواعق', 'system to protect from lightning', 'Lightning protection is on the roof.'],
      ['single line diagram (SLD)', 'المخطط الأحادي', 'simple drawing of power distribution', 'Refer to the SLD for cable sizes.']
    ], 'electrical', 'B1') },
    { id: 'construction', title: 'Construction & documents', ar: 'الإنشاءات والمستندات', level: 'B1', words: V([
      ['shop drawing', 'مخطط تنفيذي', 'detailed drawing made by the contractor for installation', 'Submit the shop drawings for approval.'],
      ['as-built drawing', 'مخطط حسب التنفيذ', 'drawing showing what was actually built', 'As-built drawings are due at handover.'],
      ['material submittal', 'طلب اعتماد مواد', 'document asking approval of a product', 'The material submittal for valves was approved.'],
      ['method statement', 'طريقة التنفيذ', 'document explaining how work will be done safely', 'Please submit the method statement for duct installation.'],
      ['specifications', 'المواصفات الفنية', 'written technical requirements', 'The pipes must comply with the specifications.'],
      ['clash', 'تعارض', 'two elements in the same space', 'There is a clash between the duct and the beam.'],
      ['coordination drawing', 'مخطط تنسيقي', 'drawing that combines all services', 'The coordination drawing shows all MEP services.', 'combined services drawing'],
      ['false ceiling', 'سقف مستعار', 'ceiling hung below the slab', 'The FCU is above the false ceiling.', 'suspended ceiling'],
      ['shaft', 'شافت / مسار رأسي', 'vertical opening for services', 'The risers pass through the shaft.'],
      ['slab', 'بلاطة', 'concrete floor', 'Sleeves must be fixed before casting the slab.'],
      ['sleeve', 'جلبة', 'pipe piece through a wall or slab', 'Provide sleeves for all penetrations.'],
      ['scaffolding', 'سقالات', 'temporary structure for working at height', 'The scaffolding needs a safety tag.'],
      ['subcontractor', 'مقاول باطن', 'company hired by the main contractor', 'The MEP subcontractor has 40 workers.'],
      ['main contractor', 'المقاول الرئيسي', 'company with the main contract', 'The main contractor controls the site.'],
      ['consultant', 'الاستشاري', 'engineer who designs and supervises for the client', 'The consultant inspected the work.', 'the Engineer'],
      ['punch list', 'قائمة الملاحظات النهائية', 'list of small defects to fix before handover', 'We closed 90% of the punch list.', 'snag list'],
      ['mock-up', 'نموذج تجريبي', 'sample installation for approval', 'The client approved the bathroom mock-up.'],
      ['retention', 'المحتجزات (ضمان)', 'money held until defects period ends', 'Retention is 10% of each payment.'],
      ['defects liability period', 'فترة ضمان العيوب', 'time contractor must fix defects', 'The defects liability period is one year.'],
      ['fit-out', 'تشطيبات داخلية', 'interior works to make a space usable', 'The fit-out works include MEP and finishes.']
    ], 'construction', 'B1') },
    { id: 'pm', title: 'Project management terms', ar: 'مصطلحات إدارة المشاريع', level: 'B2', words: V([
      ['BOQ (Bill of Quantities)', 'جدول الكميات', 'list of work items with quantities and prices', 'The BOQ includes 120 MEP items.'],
      ['RFI (Request for Information)', 'طلب معلومات', 'formal question to the designer when something is unclear', 'We raised an RFI about the pipe size.'],
      ['MIR (Material Inspection Request)', 'طلب فحص مواد', 'request to inspect delivered material', 'Please attend the MIR for the chillers tomorrow.'],
      ['IR (Inspection Request)', 'طلب فحص', 'request to inspect completed work', 'The IR for the ductwork was approved.'],
      ['WIR (Work Inspection Request)', 'طلب فحص أعمال', 'request to inspect work before covering it', 'Submit the WIR before closing the ceiling.'],
      ['NCR (Non-Conformance Report)', 'تقرير عدم مطابقة', 'report of work not meeting requirements', 'The consultant issued an NCR for the insulation.'],
      ['site observation', 'ملاحظة موقع', 'comment recorded during a site visit', 'Please close the site observation by Thursday.', 'SOR'],
      ['MOM (Minutes of Meeting)', 'محضر الاجتماع', 'written record of a meeting', 'I will circulate the MOM today.'],
      ['progress report', 'تقرير الإنجاز', 'report showing work done and status', 'The weekly progress report shows 65% completion.'],
      ['variation order (VO)', 'أمر تغيير', 'approved change to the contract scope', 'The client issued a VO for extra FCUs.', 'change order'],
      ['claim', 'مطالبة', 'formal request for more time or money', 'The contractor submitted a claim for delay.'],
      ['project schedule', 'البرنامج الزمني', 'plan of activities and dates', 'The project schedule was updated in Primavera.', 'programme'],
      ['critical path', 'المسار الحرج', 'chain of activities that sets the finish date', 'The chiller delivery is on the critical path.'],
      ['delay analysis', 'تحليل التأخير', 'study of what caused the delay and its effect', 'A delay analysis is attached to the claim.'],
      ['testing and commissioning (T&C)', 'الاختبار والتشغيل', 'checking that systems work as designed', 'T&C of the fire alarm starts next week.'],
      ['extension of time (EOT)', 'تمديد المدة', 'more time granted to the contractor', 'We requested a 30-day EOT.'],
      ['baseline', 'البرنامج الأساسي', 'the original approved plan', 'Compare progress with the baseline.'],
      ['float', 'الفائض الزمني', 'time an activity can slip without delaying the project', 'This activity has 5 days of float.'],
      ['milestone', 'مرحلة رئيسية', 'important point in the schedule', 'Power-on is a key milestone.'],
      ['scope of work', 'نطاق العمل', 'what work is included', 'This item is outside our scope of work.'],
      ['procurement', 'المشتريات / التوريد', 'buying materials and services', 'Procurement of long-lead items must start now.'],
      ['long-lead item', 'بند توريد طويل', 'item that takes long to manufacture', 'Chillers are long-lead items.'],
      ['handover documents', 'مستندات التسليم', 'O&M manuals, as-builts, warranties', 'Handover documents are 70% ready.'],
      ['O&M manual', 'دليل التشغيل والصيانة', 'operation and maintenance instructions', 'Submit the O&M manuals before handover.'],
      ['interim payment certificate (IPC)', 'شهادة دفعة مرحلية', 'certificate for monthly payment', 'IPC No. 12 was certified.'],
      ['back charge', 'خصم على المقاول', 'cost charged to a party who caused damage', 'The main contractor issued a back charge.'],
      ['liquidated damages (LDs)', 'غرامات التأخير', 'pre-agreed penalty for delay', 'LDs apply after the completion date.'],
      ['lookahead schedule', 'البرنامج قصير المدى', 'short-term plan for the next 2–3 weeks', 'Share the three-week lookahead by Sunday.'],
      ['transmittal', 'خطاب إرسال مستندات', 'cover document listing what is sent', 'The drawings were sent with transmittal T-045.'],
      ['substantial completion', 'الإنجاز الجوهري', 'when the work can be used for its purpose', 'Substantial completion is planned for Q3.']
    ], 'pm', 'B2') },
    { id: 'advanced', title: 'Advanced professional', ar: 'مفردات مهنية متقدمة', level: 'C1', words: V([
      ['expedite', 'يُسرّع', 'make something happen faster', 'Please expedite the approval.', 'speed up', 'delay'],
      ['discrepancy', 'تناقض / اختلاف', 'difference between things that should match', 'There is a discrepancy between the BOQ and drawings.', 'inconsistency'],
      ['mitigate', 'يخفف', 'reduce the bad effect', 'We proposed measures to mitigate the delay.', 'reduce', 'aggravate'],
      ['entitlement', 'استحقاق', 'right to receive something', 'The contractor\'s entitlement to an EOT is under review.'],
      ['notwithstanding', 'بالرغم من', 'despite (formal)', 'Notwithstanding the above, the works shall continue.', 'despite'],
      ['compliance', 'امتثال / مطابقة', 'following rules or standards', 'Full compliance with SBC is required.', 'conformity'],
      ['feasible', 'ممكن التنفيذ', 'possible and practical', 'Rerouting the duct is feasible.', 'viable', 'impractical'],
      ['comprehensive', 'شامل', 'including everything', 'We need a comprehensive report.', 'thorough'],
      ['allocate', 'يخصص', 'give for a purpose', 'Allocate two technicians to Level 3.', 'assign'],
      ['concise', 'موجز', 'short and clear', 'Keep the report concise.', 'brief', 'wordy'],
      ['stakeholder', 'صاحب مصلحة', 'person or party affected by the project', 'All stakeholders attended the workshop.'],
      ['leverage', 'يستفيد / يستثمر', 'use something to get an advantage', 'We can leverage our supplier relationship.'],
      ['contingency', 'احتياطي / طوارئ', 'extra money or plan for risk', 'The budget has a 5% contingency.'],
      ['commence', 'يبدأ (رسمي)', 'begin', 'Works shall commence on 1 March.', 'start', 'conclude'],
      ['adhere to', 'يلتزم بـ', 'follow exactly', 'All staff must adhere to the HSE plan.', 'comply with'],
      ['rectify', 'يصحح', 'correct a defect', 'Please rectify the defects within 7 days.', 'correct'],
      ['substantiate', 'يثبت بالدليل', 'support with evidence', 'Please substantiate the claim with records.', 'justify'],
      ['without prejudice', 'دون المساس بالحقوق', 'legal phrase: this letter doesn\'t give up rights', 'This offer is made without prejudice.'],
      ['pursuant to', 'وفقاً لـ', 'according to (formal)', 'Pursuant to Clause 20.1, we hereby notify you.', 'in accordance with'],
      ['bottleneck', 'عنق الزجاجة', 'point that slows everything', 'Approvals are the main bottleneck.']
    ], 'advanced', 'C1') }
  ];

  /* ---------------- Daily conversations (static model + AI roleplay) ---------------- */
  const DIALOGUES = [
    { id: 'intro', level: 'A1', title: 'Introducing yourself', ar: 'التعارف وتقديم النفس', role: 'a friendly new colleague at the office in Riyadh',
      lines: [['A', 'Hi, I\'m Sarah. I\'m new here.', 'مرحباً، أنا سارة. أنا جديدة هنا.'], ['B', 'Nice to meet you, Sarah. I\'m Mohamed. I\'m a mechanical engineer.', 'تشرفت بمعرفتك يا سارة. أنا محمد، مهندس ميكانيكا.'], ['A', 'Nice to meet you too. Where are you from?', 'وأنا كذلك. من أين أنت؟'], ['B', 'I\'m from Egypt, but I live in Riyadh now.', 'أنا من مصر، لكني أعيش في الرياض الآن.'], ['A', 'How long have you worked here?', 'منذ متى تعمل هنا؟'], ['B', 'Since February. I work on the MEP fit-out.', 'منذ فبراير. أعمل في تشطيبات الأعمال الكهروميكانيكية.']] },
    { id: 'restaurant', level: 'A1', title: 'At a restaurant', ar: 'في المطعم', role: 'a waiter at a restaurant',
      lines: [['A', 'Good evening. Do you have a reservation?', 'مساء الخير. هل لديك حجز؟'], ['B', 'Yes, a table for two under Mohamed.', 'نعم، طاولة لشخصين باسم محمد.'], ['A', 'This way, please. Here is the menu.', 'من هنا لو سمحت. هذه القائمة.'], ['B', 'Thank you. Could I have the grilled chicken, please?', 'شكراً. ممكن الدجاج المشوي من فضلك؟'], ['A', 'Of course. Anything to drink?', 'بالتأكيد. أي مشروب؟'], ['B', 'Just water, please. And could we have the bill at the end?', 'ماء فقط. وممكن الفاتورة في النهاية؟']] },
    { id: 'shopping', level: 'A1', title: 'Shopping', ar: 'التسوق', role: 'a shop assistant in a mall',
      lines: [['A', 'Hello, can I help you?', 'أهلاً، هل أساعدك؟'], ['B', 'Yes, I\'m looking for a white shirt, size large.', 'نعم، أبحث عن قميص أبيض مقاس لارج.'], ['A', 'Here you are. The fitting room is over there.', 'تفضل. غرفة القياس هناك.'], ['B', 'How much is it?', 'بكم هذا؟'], ['A', 'It\'s 150 riyals. It\'s on sale today.', '150 ريالاً. عليه تخفيض اليوم.'], ['B', 'Great, I\'ll take it. Can I pay by card?', 'ممتاز، سآخذه. ممكن أدفع بالبطاقة؟']] },
    { id: 'airport', level: 'A2', title: 'At the airport', ar: 'في المطار', role: 'a check-in agent at King Khalid International Airport',
      lines: [['A', 'Good morning. Passport and ticket, please.', 'صباح الخير. الجواز والتذكرة من فضلك.'], ['B', 'Here you are. I\'m flying to Cairo.', 'تفضل. مسافر إلى القاهرة.'], ['A', 'Any bags to check in?', 'هل لديك حقائب للشحن؟'], ['B', 'Just one suitcase. Can I have a window seat?', 'حقيبة واحدة. ممكن مقعد بجانب الشباك؟'], ['A', 'Sure. Boarding starts at 9:15 from gate 22.', 'بالتأكيد. الصعود يبدأ 9:15 من البوابة 22.'], ['B', 'Thank you. Is the flight on time?', 'شكراً. هل الرحلة في موعدها؟']] },
    { id: 'hotel', level: 'A2', title: 'Hotel check-in', ar: 'في الفندق', role: 'a hotel receptionist',
      lines: [['A', 'Welcome. How can I help you?', 'أهلاً بك. كيف أخدمك؟'], ['B', 'I have a booking for three nights.', 'لدي حجز لثلاث ليالٍ.'], ['A', 'May I have your name, please?', 'اسمك من فضلك؟'], ['B', 'Mohamed. Is breakfast included?', 'محمد. هل الإفطار مشمول؟'], ['A', 'Yes, from 6 to 10 a.m. Your room is 512.', 'نعم من 6 إلى 10 صباحاً. غرفتك 512.'], ['B', 'Great. What time is check-out?', 'ممتاز. ما موعد تسجيل المغادرة؟']] },
    { id: 'transport', level: 'A2', title: 'Taxi & transport', ar: 'المواصلات', role: 'a taxi driver in Riyadh',
      lines: [['A', 'Where to?', 'إلى أين؟'], ['B', 'To Al-Sahafa district, please. Near the Innovation Tower.', 'إلى حي الصحافة من فضلك، قرب برج الابتكار.'], ['A', 'Traffic is heavy now. It will take 30 minutes.', 'الزحمة شديدة الآن. سيستغرق 30 دقيقة.'], ['B', 'That\'s fine. Can you take the ring road?', 'لا مشكلة. ممكن تأخذ الطريق الدائري؟'], ['A', 'Sure. Here we are.', 'بالتأكيد. وصلنا.'], ['B', 'How much do I owe you?', 'كم الحساب؟']] },
    { id: 'bank', level: 'A2', title: 'At the bank', ar: 'في البنك', role: 'a bank customer service officer',
      lines: [['A', 'Good morning. How can I help?', 'صباح الخير. كيف أساعدك؟'], ['B', 'I\'d like to transfer money to Egypt.', 'أريد تحويل أموال إلى مصر.'], ['A', 'Do you have the IBAN of the receiver?', 'هل لديك رقم الآيبان للمستلم؟'], ['B', 'Yes, here it is. What is the fee?', 'نعم، تفضل. كم الرسوم؟'], ['A', 'It\'s 25 riyals, and it arrives in two days.', '25 ريالاً، ويصل خلال يومين.'], ['B', 'OK. Please go ahead.', 'حسناً. تفضل نفّذ.']] },
    { id: 'phone', level: 'B1', title: 'Phone calls', ar: 'المكالمات الهاتفية', role: 'a receptionist at a supplier company',
      lines: [['A', 'Good morning, Gulf Pumps. How may I help you?', 'صباح الخير، شركة الخليج للمضخات. كيف أخدمك؟'], ['B', 'Hello, this is Mohamed from NHC. Could I speak to the sales engineer?', 'مرحباً، معك محمد من الشركة الوطنية للإسكان. ممكن أكلم مهندس المبيعات؟'], ['A', 'I\'m afraid he\'s in a meeting. Can I take a message?', 'للأسف هو في اجتماع. هل أترك له رسالة؟'], ['B', 'Yes, please ask him to call me back about the fire pump quotation.', 'نعم، اطلبي منه أن يعاود الاتصال بخصوص عرض سعر مضخة الحريق.'], ['A', 'Sure. Could you spell your name, please?', 'بالتأكيد. ممكن تتهجى اسمك؟'], ['B', 'M-O-H-A-M-E-D. My number is 055 123 4567.', 'M-O-H-A-M-E-D. رقمي 055 123 4567.']] },
    { id: 'doctor', level: 'B1', title: 'Visiting the doctor', ar: 'زيارة الطبيب', role: 'a doctor at a clinic',
      lines: [['A', 'What seems to be the problem?', 'ما المشكلة؟'], ['B', 'I\'ve had a sore throat and a fever since yesterday.', 'عندي التهاب حلق وحرارة منذ أمس.'], ['A', 'Let me check. Open your mouth, please.', 'دعني أفحص. افتح فمك من فضلك.'], ['B', 'Do I need antibiotics?', 'هل أحتاج مضاداً حيوياً؟'], ['A', 'No, it\'s a virus. Rest and drink plenty of fluids.', 'لا، إنه فيروس. ارتح واشرب سوائل كثيرة.'], ['B', 'Can I have a sick note for work?', 'ممكن تقرير إجازة مرضية للعمل؟']] },
    { id: 'social', level: 'B1', title: 'Social small talk', ar: 'الحياة الاجتماعية', role: 'a friendly British engineer at a networking event',
      lines: [['A', 'So, what do you do?', 'ما طبيعة عملك؟'], ['B', 'I\'m an MEP engineer. I work on an office tower fit-out.', 'أنا مهندس كهروميكانيك. أعمل على تشطيب برج مكاتب.'], ['A', 'Interesting! How do you find living in Riyadh?', 'مثير! كيف تجد الحياة في الرياض؟'], ['B', 'I really like it. The city is growing so fast.', 'تعجبني جداً. المدينة تنمو بسرعة كبيرة.'], ['A', 'What do you do in your free time?', 'ماذا تفعل في وقت فراغك؟'], ['B', 'I\'m building some engineering calculation tools, and I\'m improving my English.', 'أبني بعض أدوات الحسابات الهندسية، وأحسّن لغتي الإنجليزية.']] },
    { id: 'meeting', level: 'B2', title: 'Workplace meeting', ar: 'الاجتماعات', role: 'the project manager chairing a weekly progress meeting',
      lines: [['A', 'Let\'s start. Mohamed, could you give us the MEP update?', 'لنبدأ. محمد، هل تعطينا تحديث الأعمال الكهروميكانيكية؟'], ['B', 'Sure. Ductwork on Level 4 is 80% complete, and we\'re on track for the ceiling closure.', 'بالتأكيد. مجاري الهواء في الدور الرابع منجزة 80%، ونحن على المسار لإغلاق السقف.'], ['A', 'Any issues?', 'أي مشاكل؟'], ['B', 'One. The FCU delivery has slipped by a week, which affects the testing.', 'واحدة. توريد وحدات FCU تأخر أسبوعاً، وهذا يؤثر على الاختبارات.'], ['A', 'What do you propose?', 'ماذا تقترح؟'], ['B', 'We\'ll resequence the work and start with Level 5. I\'ll share a revised lookahead today.', 'سنعيد ترتيب الأعمال ونبدأ بالدور الخامس. سأرسل البرنامج قصير المدى المعدل اليوم.']] }
  ];

  /* ---------------- Site Communication Simulator scenarios ---------------- */
  const SITE_ROLES = ['Consultant', 'Contractor', 'Project Manager', 'MEP Manager', 'Site Engineer', 'QA/QC Engineer', 'Client'];
  const SITE_SCENARIOS = [
    { id: 'delay', title: 'Discussing a delay', ar: 'مناقشة تأخر الأعمال', ai: 'Project Manager', brief: 'The chilled water pipe installation on Levels 6–8 is two weeks behind. The PM wants reasons and a recovery plan.' },
    { id: 'variation', title: 'Requesting a variation', ar: 'طلب تعديل الأعمال', ai: 'Client', brief: 'The client wants 12 extra FCUs for a new meeting room. You need to explain cost and time impact and ask for a formal VO.' },
    { id: 'followup', title: 'Following up the contractor', ar: 'متابعة المقاول', ai: 'Contractor', brief: 'You represent the client. The MEP subcontractor has not closed 15 site observations from last week.' },
    { id: 'comments', title: 'Replying to consultant comments', ar: 'الرد على ملاحظات الاستشاري', ai: 'Consultant', brief: 'The consultant rejected the fire fighting shop drawing (code C) because sprinkler spacing exceeds NFPA 13 limits in the corridor.' },
    { id: 'drawings', title: 'Discussing drawings & clashes', ar: 'مناقشة المخططات', ai: 'MEP Manager', brief: 'A 600×400 duct clashes with a beam and a cable tray above the corridor on Level 3. Agree a solution.' },
    { id: 'material', title: 'Material approval', ar: 'اعتماد المواد', ai: 'Consultant', brief: 'You are submitting an alternative brand of butterfly valve. The consultant wants proof it is equal or better than the specified brand.' },
    { id: 'inspection', title: 'Inspection request follow-up', ar: 'متابعة طلبات الفحص', ai: 'QA/QC Engineer', brief: 'Your WIR for duct leakage testing on Level 5 has been pending for three days. You need the inspection today.' },
    { id: 'technical', title: 'Explaining a technical problem', ar: 'شرح مشكلة فنية', ai: 'Client', brief: 'The fire pump trips on high pressure during the weekly test. Explain the problem to a non-technical client and the plan to fix it.' },
    { id: 'quality', title: 'Discussing workmanship quality', ar: 'مناقشة جودة التنفيذ', ai: 'Site Engineer', brief: 'You found poor duct insulation joints and unsupported pipes on Level 2. Discuss with the contractor\'s site engineer.' },
    { id: 'schedule', title: 'Schedule follow-up', ar: 'متابعة البرنامج الزمني', ai: 'Project Manager', brief: 'The updated programme shows T&C starting late. Discuss the critical path and what must happen this month.' }
  ];

  const INTERVIEW_ROLES = ['MEP Engineer', 'Mechanical Engineer', 'HVAC Engineer', 'Project Engineer', 'Project Manager', 'Construction Manager'];

  /* ---------------- Business English topics ---------------- */
  const BUSINESS = [
    { id: 'b-meetings', title: 'Meetings', ar: 'اجتماعات العمل', phrases: [
      ['Let\'s get started.', 'لنبدأ.'], ['Could you walk us through the status?', 'هل تشرح لنا الوضع خطوة بخطوة؟'], ['I\'d like to add something here.', 'أود إضافة شيء هنا.'], ['Sorry to interrupt, but…', 'آسف للمقاطعة، لكن…'], ['Let\'s park that for now and come back to it.', 'لنؤجل هذه النقطة ونعود لها.'], ['To sum up, we agreed that…', 'للتلخيص، اتفقنا على أن…'], ['Who will take the action on this?', 'من سيتولى هذا الإجراء؟'], ['Let\'s wrap up.', 'لننهِ الاجتماع.']] },
    { id: 'b-present', title: 'Presentations', ar: 'تقديم العروض', phrases: [
      ['Today I\'m going to talk about…', 'اليوم سأتحدث عن…'], ['Let me start with an overview.', 'دعوني أبدأ بنظرة عامة.'], ['As you can see on this slide…', 'كما ترون في هذه الشريحة…'], ['This brings me to my next point.', 'وهذا يقودني إلى النقطة التالية.'], ['The key takeaway is…', 'الخلاصة الأهم هي…'], ['I\'d be happy to take any questions.', 'يسعدني الإجابة عن أي أسئلة.']] },
    { id: 'b-negotiate', title: 'Negotiation', ar: 'التفاوض', phrases: [
      ['What flexibility do you have on the price?', 'ما مدى مرونتكم في السعر؟'], ['We could consider that if…', 'يمكن أن ننظر في ذلك إذا…'], ['That\'s a bit higher than our budget.', 'هذا أعلى قليلاً من ميزانيتنا.'], ['Would you be willing to…?', 'هل أنتم مستعدون لـ…؟'], ['Let\'s meet halfway.', 'لنلتقِ في المنتصف.'], ['I need to check this with my management.', 'أحتاج لمراجعة ذلك مع الإدارة.'], ['Can we agree on that in writing?', 'هل نتفق على ذلك كتابياً؟']] },
    { id: 'b-managers', title: 'Talking to managers & clients', ar: 'التواصل مع المديرين والعملاء', phrases: [
      ['I wanted to give you a quick heads-up.', 'أردت تنبيهك سريعاً.'], ['Do you have five minutes?', 'هل لديك خمس دقائق؟'], ['I\'d appreciate your guidance on this.', 'أقدّر توجيهك في هذا.'], ['Here are two options and my recommendation.', 'هذان خياران وتوصيتي.'], ['I\'ll keep you posted.', 'سأبقيك على اطلاع.'], ['Thank you for your patience.', 'شكراً لصبرك.']] },
    { id: 'b-problems', title: 'Explaining problems & solutions', ar: 'شرح المشكلات والحلول', phrases: [
      ['The root cause is…', 'السبب الجذري هو…'], ['This is affecting…', 'هذا يؤثر على…'], ['As a temporary measure, we…', 'كإجراء مؤقت، نحن…'], ['The permanent solution would be…', 'الحل الدائم سيكون…'], ['We expect to resolve it by…', 'نتوقع حلها بحلول…'], ['To prevent this in future, we will…', 'لمنع تكرار ذلك سنقوم بـ…']] },
    { id: 'b-discussion', title: 'Managing a discussion', ar: 'إدارة النقاش', phrases: [
      ['I see your point, but…', 'أفهم وجهة نظرك، لكن…'], ['Could you clarify what you mean by…?', 'هل توضح ما تقصده بـ…؟'], ['Let\'s hear from everyone.', 'لنسمع من الجميع.'], ['I\'m not sure I agree.', 'لست متأكداً أنني أوافق.'], ['Let\'s focus on the solution.', 'لنركز على الحل.'], ['Can we agree on the next steps?', 'هل نتفق على الخطوات التالية؟']] },
    { id: 'b-interview', title: 'Interviews & introducing your experience', ar: 'المقابلات والتعريف بالخبرات', phrases: [
      ['I have over 13 years of experience in MEP construction.', 'لدي أكثر من 13 عاماً من الخبرة في الأعمال الكهروميكانيكية.'], ['In my current role, I\'m responsible for…', 'في دوري الحالي أنا مسؤول عن…'], ['One of my key achievements was…', 'من أهم إنجازاتي…'], ['I led a team of…', 'قدت فريقاً من…'], ['I\'m looking for a role where I can…', 'أبحث عن دور يمكنني فيه…'], ['That\'s a great question. Let me think for a second.', 'سؤال رائع. دعني أفكر لحظة.']] },
    { id: 'b-suppliers', title: 'Suppliers & phone calls', ar: 'التواصل مع الموردين والمكالمات المهنية', phrases: [
      ['Could you send us your best price for…?', 'هل ترسل لنا أفضل سعر لـ…؟'], ['What is the lead time?', 'ما مدة التوريد؟'], ['Is the price inclusive of VAT and delivery?', 'هل السعر شامل الضريبة والتوصيل؟'], ['We need the technical datasheet and compliance statement.', 'نحتاج الكتالوج الفني وبيان المطابقة.'], ['Could you hold the line, please?', 'ممكن تنتظر على الخط؟'], ['I\'ll send you a confirmation email.', 'سأرسل لك إيميل تأكيد.']] }
  ];

  /* ---------------- Professional email templates ---------------- */
  const EMAILS = [
    { id: 'e-rfi', title: 'Request for Information (RFI)', ar: 'طلب معلومات', body:
`Subject: RFI-MEP-023 – Clarification of Chilled Water Pipe Size, Level 4

Dear Eng. Ahmed,

We kindly request your clarification regarding the chilled water branch serving FCU-4-12.

Drawing M-401 Rev. B shows a 50 mm pipe, while the FCU schedule (M-601) indicates a flow rate that requires 65 mm.

Could you please confirm the correct size? Your response by Thursday, 5 November would allow us to proceed without affecting the ceiling closure.

Attached: marked-up drawing and FCU schedule extract.

Best regards,
Mohamed
MEP Engineer` },
    { id: 'e-submittal', title: 'Material submittal', ar: 'إرسال طلب اعتماد مواد', body:
`Subject: Material Submittal MS-FF-014 – Butterfly Valves (Fire Fighting)

Dear Sir,

Please find attached Material Submittal MS-FF-014 for the grooved butterfly valves with tamper switches, for your review and approval.

The submittal includes:
• Technical datasheets
• UL/FM certificates
• Compliance statement against Specification Section 21 13 13
• Manufacturer\'s warranty

We would appreciate your approval at your earliest convenience, as this is a long-lead item.

Best regards,
Mohamed` },
    { id: 'e-reply', title: 'Reply to consultant comments', ar: 'الرد على ملاحظات الاستشاري', body:
`Subject: RE: Shop Drawing FF-SD-007 – Status C – Response to Comments

Dear Eng. Khalid,

Thank you for your comments on shop drawing FF-SD-007.

Please find our responses below:
1. Sprinkler spacing in the corridor: revised to a maximum of 4.6 m, in line with NFPA 13.
2. Missing hanger details: added on sheet 3.
3. Zone control valve location: relocated to the stair lobby as requested.

The revised drawing (Rev. 1) is attached for your review.

Best regards,
Mohamed` },
    { id: 'e-mir', title: 'Material Inspection Request', ar: 'طلب فحص مواد', body:
`Subject: MIR-HVAC-031 – Inspection of Delivered FCUs

Dear Eng. Faisal,

Please be informed that 24 nos. of fan coil units (approved submittal MS-HV-009) have been delivered to site.

We kindly request your inspection on Sunday, 8 November at 10:00 a.m. at the Level B1 store.

Delivery note, packing list and test certificates are attached.

Best regards,
Mohamed` },
    { id: 'e-delay', title: 'Delay notification', ar: 'إخطار تأخير', body:
`Subject: Notice of Potential Delay – Chiller Delivery

Dear Sir,

We would like to notify you that the supplier has informed us of a three-week delay in the shipment of the chillers, due to a shortage of compressors at the factory.

As the chiller installation is on the critical path, this may affect the start of testing and commissioning.

To mitigate the impact, we propose to:
1. Complete all chilled water piping and pre-commissioning in advance;
2. Increase manpower for the installation once the chillers arrive.

We will keep you updated and reserve our right to an extension of time in accordance with the contract.

Best regards,
Mohamed` },
    { id: 'e-mom', title: 'Minutes of Meeting (MOM)', ar: 'محضر اجتماع', body:
`Subject: MOM – Weekly MEP Coordination Meeting No. 14

Date: Monday, 2 November 2026 | Location: Site office
Attendees: Client, Consultant, Main Contractor, MEP Subcontractor

1. Progress
   1.1 Ductwork Level 4: 80% complete.
   1.2 Fire alarm cabling Level 3: complete; IR to be raised.
2. Issues
   2.1 Duct/beam clash on Level 3 corridor – MEP to submit revised routing. Action: MEP | Due: 5 Nov.
   2.2 FCU delivery delayed by one week. Action: Procurement | Due: 9 Nov.
3. Next meeting: Monday, 9 November 2026, 10:00 a.m.

Please send any comments within 48 hours; otherwise, these minutes will be considered final.` },
    { id: 'e-weekly', title: 'Weekly progress report', ar: 'تقرير أسبوعي', body:
`Subject: Weekly MEP Progress Report – Week 44

Dear All,

Please find below a summary of MEP progress for Week 44:

Completed this week
• Chilled water piping Level 5 – 100%
• Sprinkler pipe hydrostatic test Level 4 – passed

Planned for next week
• Duct insulation Level 5
• FCU installation Level 6

Issues / Risks
• Pending approval of the alternative valve submittal (MS-FF-014)

Overall MEP progress: 62% (planned 65%).

Best regards,
Mohamed` },
    { id: 'e-ncr', title: 'Response to NCR', ar: 'الرد على تقرير عدم مطابقة', body:
`Subject: Response to NCR-QA-019 – Duct Insulation Joints, Level 2

Dear Eng. Omar,

We acknowledge receipt of NCR-QA-019.

Root cause: The insulation joints were not taped according to the approved method statement.
Corrective action: All affected joints on Level 2 will be re-taped by 10 November.
Preventive action: Toolbox talk for the insulation team, and a QC check before each WIR.

We will raise a WIR for re-inspection upon completion.

Best regards,
Mohamed` }
  ];

  /* ---------------- Reading passages ---------------- */
  const READINGS = [
    { id: 'r1', level: 'A1', title: 'My Day', text: 'My name is Ali. I am an engineer. I work in Riyadh. I start work at seven in the morning. I drive to the site. At the site, I check the work and talk to the workers. I have lunch at one o\'clock. I go home at five. In the evening, I study English for thirty minutes.',
      q: [['What is Ali\'s job?', ['A teacher', 'An engineer', 'A driver'], 1], ['When does he start work?', ['At 7 a.m.', 'At 5 p.m.', 'At 1 p.m.'], 0], ['What does he do in the evening?', ['He works', 'He studies English', 'He drives'], 1]] },
    { id: 'r2', level: 'A2', title: 'A Problem on Site', text: 'Last Tuesday, the plumbing team found a leak in the water supply pipe on the third floor. The pipe was behind a wall, so they had to open the wall. The site engineer called the supplier because the fitting was new. The supplier sent a technician the next day. He replaced the fitting, and the team tested the pipe again. This time, the test passed.',
      q: [['Where was the leak?', ['On the roof', 'On the third floor', 'In the basement'], 1], ['Why did the engineer call the supplier?', ['The fitting was new', 'The wall was broken', 'The test passed'], 0], ['What happened at the end?', ['The test failed', 'The test passed', 'They closed the project'], 1]] },
    { id: 'r3', level: 'B1', title: 'Why Testing and Commissioning Matters', text: 'Testing and commissioning (T&C) is the stage where engineers check that every system works as designed. For HVAC, this includes measuring air flow at each diffuser and adjusting dampers until the design values are reached. For fire fighting, the pumps are started, the pressures are recorded, and alarm signals are checked at the control panel. Many projects treat T&C as the last step, but experienced engineers plan it from the beginning. If access panels are missing or valves are installed in places that cannot be reached, T&C becomes slow and expensive.',
      q: [['What is the purpose of T&C?', ['To design the systems', 'To check systems work as designed', 'To buy materials'], 1], ['What do experienced engineers do?', ['Plan T&C from the beginning', 'Skip T&C', 'Do T&C before installation'], 0], ['What can make T&C slow?', ['Too many diffusers', 'Missing access panels', 'Good planning'], 1]] },
    { id: 'r4', level: 'B2', title: 'The Cost of Late Coordination', text: 'In fit-out projects, the ceiling void is often the most congested space in the building. Ducts, sprinkler pipes, cable trays and drainage lines all compete for the same few hundred millimetres. When coordination is left until installation, clashes are discovered on site, and teams resort to quick fixes that may compromise performance or maintenance access. A combined services drawing, reviewed by all disciplines before work starts, typically costs a fraction of the rework it prevents. Nevertheless, coordination is frequently rushed because it produces no visible progress on site, which makes it an easy target when schedules are under pressure.',
      q: [['Why is the ceiling void a problem?', ['It is too large', 'Many services compete for little space', 'It has no services'], 1], ['What does the passage say about combined services drawings?', ['They are expensive and useless', 'They cost less than the rework they prevent', 'They replace site work'], 1], ['Why is coordination often rushed?', ['It shows no visible site progress', 'It is illegal', 'Consultants refuse it'], 0]] },
    { id: 'r5', level: 'C1', title: 'Notices and Entitlement', text: 'Under most standard forms of contract, a contractor who believes it is entitled to additional time or money must give notice within a specified period, frequently 28 days from becoming aware of the event. Failure to do so may extinguish the claim altogether, irrespective of its merits. Consequently, the discipline of issuing timely, well-substantiated notices is arguably as important as technical competence. A notice need not quantify the full impact; it should, however, identify the event, reference the relevant clause, and state the intention to claim, with detailed particulars to follow as records become available.',
      q: [['What happens if notice is not given on time?', ['The claim may be lost', 'The claim doubles', 'Nothing'], 0], ['What must a notice contain?', ['The full cost calculation only', 'The event, the clause and the intention to claim', 'A legal judgment'], 1], ['"Irrespective of its merits" means…', ['because it is strong', 'even if it is a good claim', 'only if it is weak'], 1]] }
  ];

  /* ---------------- Pronunciation: minimal pairs (common Arabic-speaker issues) ---------------- */
  const PRONUNCIATION = [
    { id: 'p-b', title: '/p/ vs /b/', ar: 'العربية ليس فيها P؛ كثيرون ينطقونها B. انفخ هواءً خفيفاً مع P.', pairs: [['pump', 'bump'], ['pipe', 'bribe'], ['pen', 'Ben'], ['pole', 'bowl'], ['pack', 'back'], ['plan', 'bland']] },
    { id: 'p-v', title: '/v/ vs /f/', ar: 'V صوت مجهور (تهتز الأحبال الصوتية)، F مهموس.', pairs: [['valve', 'fault'], ['vent', 'fent'], ['view', 'few'], ['very', 'ferry'], ['van', 'fan'], ['vast', 'fast']] },
    { id: 'p-th', title: '/θ/ "th" vs /s/ and /t/', ar: 'ضع طرف اللسان بين الأسنان: think وليس sink أو tink.', pairs: [['think', 'sink'], ['three', 'tree'], ['thick', 'tick'], ['thermal', 'sermon'], ['path', 'pass'], ['thank', 'tank']] },
    { id: 'p-i', title: 'Short /ɪ/ vs long /iː/', ar: 'ship قصيرة ومرتخية، sheep طويلة ومشدودة.', pairs: [['fill', 'feel'], ['ship', 'sheep'], ['live', 'leave'], ['fit', 'feet'], ['bit', 'beat'], ['still', 'steel']] },
    { id: 'p-e', title: '/e/ vs /ɪ/', ar: 'كثير من العرب يخلطون بين e و i: pen/pin.', pairs: [['pen', 'pin'], ['test', 'twist'], ['set', 'sit'], ['bed', 'bid'], ['check', 'chick'], ['left', 'lift']] },
    { id: 'p-cluster', title: 'Consonant clusters', ar: 'لا تضف حرفاً متحركاً قبل أو بين السواكن: street وليس istreet أو sitreet.', pairs: [['street', 'sprinkler'], ['structure', 'strength'], ['split', 'spray'], ['screen', 'scrap'], ['tested', 'texts'], ['months', 'sixths']] },
    { id: 'p-stress', title: 'Word stress in technical words', ar: 'شدّة المقطع تغيّر وضوح الكلمة. المقطع المكتوب بحروف كبيرة هو المشدّد.', pairs: [['comMISsioning', 'MAINtenance'], ['ventiLAtion', 'distriBUtion'], ['engiNEER', 'deVElopment'], ['specifiCAtion', 'insuLAtion'], ['calcuLAtion', 'coordiNAtion'], ['PHOtograph', 'phoTOgraphy']] }
  ];

  /* ---------------- Placement test ----------------
     [level, question, options, correctIndex, skill]  */
  const PLACEMENT = [
    ['A1', 'My name ___ Ahmed.', ['are', 'is', 'am', 'be'], 1, 'grammar'],
    ['A1', 'She ___ in Riyadh.', ['live', 'lives', 'living', 'is live'], 1, 'grammar'],
    ['A1', 'Choose the opposite of "cheap":', ['small', 'expensive', 'easy', 'fast'], 1, 'vocabulary'],
    ['A1', 'I am ___ engineer.', ['a', 'an', 'the', '—'], 1, 'grammar'],
    ['A1', '"Where are you from?" — "___"', ['I\'m fine.', 'I\'m from Egypt.', 'I\'m 35.', 'Yes, I am.'], 1, 'speaking'],
    ['A2', 'We ___ the report yesterday.', ['send', 'sent', 'have sent', 'sending'], 1, 'grammar'],
    ['A2', 'The meeting is ___ Monday ___ 10 a.m.', ['in / on', 'on / at', 'at / in', 'on / in'], 1, 'grammar'],
    ['A2', 'A "deadline" is…', ['the start of a project', 'the last time to finish something', 'a kind of pipe', 'a meeting room'], 1, 'vocabulary'],
    ['A2', 'Look! The workers ___ the scaffolding.', ['remove', 'are removing', 'removed', 'removes'], 1, 'grammar'],
    ['A2', 'This pump is ___ than the old one.', ['more quiet', 'quieter', 'quietest', 'most quiet'], 1, 'grammar'],
    ['B1', 'I ___ here since 2019.', ['work', 'am working', 'have worked', 'worked'], 2, 'grammar'],
    ['B1', 'If the material arrives today, we ___ start tomorrow.', ['would', 'will', 'had', 'are'], 1, 'grammar'],
    ['B1', 'The drawings ___ by the consultant last week.', ['approved', 'were approved', 'have approved', 'are approving'], 1, 'grammar'],
    ['B1', 'The work stopped ___ the rain.', ['because', 'due to', 'although', 'so'], 1, 'grammar'],
    ['B1', 'Choose the best synonym for "postpone":', ['cancel', 'delay', 'approve', 'finish'], 1, 'vocabulary'],
    ['B2', 'The engineer ___ approved the drawing is on leave.', ['which', 'who', 'whose', 'where'], 1, 'grammar'],
    ['B2', 'He told me that the pump ___ damaged.', ['is', 'was', 'will be', 'has'], 1, 'grammar'],
    ['B2', 'We need to ___ a solution before Thursday.', ['come up with', 'call off', 'put up with', 'look after'], 0, 'vocabulary'],
    ['B2', 'If we had tested the line, we ___ the leak.', ['would find', 'will find', 'would have found', 'found'], 2, 'grammar'],
    ['B2', 'Which sentence is the most polite?', ['Send me the file now.', 'I want the file.', 'Could you send me the file when you have a moment?', 'File, please.'], 2, 'speaking'],
    ['C1', 'Not only ___ late, but it was also incomplete.', ['the report was', 'was the report', 'the report is', 'is the report'], 1, 'grammar'],
    ['C1', '___ you require further information, please contact us.', ['If will', 'Should', 'Would', 'Unless'], 1, 'grammar'],
    ['C1', '"Please expedite the approval" means…', ['cancel it', 'make it happen faster', 'review it again', 'delay it'], 1, 'vocabulary'],
    ['C1', 'Choose the most diplomatic option:', ['Your design is wrong.', 'There appears to be a discrepancy in the design.', 'You failed.', 'Bad design.'], 1, 'writing'],
    ['C1', 'The measures were taken to ___ the impact of the delay.', ['mitigate', 'migrate', 'motivate', 'mediate'], 0, 'vocabulary'],
    ['C2', 'We recommend that the contractor ___ a revised programme.', ['submits', 'submit', 'submitted', 'will submit'], 1, 'grammar'],
    ['C2', '___ we known about the clash, we would have rerouted the duct.', ['If', 'Had', 'Have', 'Were'], 1, 'grammar'],
    ['C2', 'If the design had been coordinated, we ___ these problems now.', ['wouldn\'t face', 'wouldn\'t be facing', 'won\'t face', 'hadn\'t faced'], 1, 'grammar'],
    ['C2', '"Notwithstanding the above" is closest to…', ['because of the above', 'in spite of the above', 'as stated above', 'below'], 1, 'vocabulary'],
    ['C2', 'Choose the correct sentence:', ['It is essential that every joint is be tested.', 'It is essential that every joint be tested.', 'It is essential every joint to be tested.', 'It essential that joint tested.'], 1, 'grammar']
  ];
  const PLACEMENT_READING = { text: READINGS[2].text, q: READINGS[2].q };

  /* ---------------- Level units (curriculum map) ---------------- */
  const UNITS = {
    A1: [
      { t: 'Hello & introductions', g: 'g-be', v: 'daily', d: 'intro' },
      { t: 'Jobs and articles', g: 'g-articles', v: 'work', d: 'restaurant' },
      { t: 'Describing things', g: 'g-adjorder', v: 'daily', d: 'shopping' },
      { t: 'Daily routine', g: 'g-presimple', v: 'daily', d: 'intro', r: 'r1' }
    ],
    A2: [
      { t: 'Time and place', g: 'g-preposition', v: 'work', d: 'transport' },
      { t: 'What happened?', g: 'g-past', v: 'work', d: 'airport', r: 'r2' },
      { t: 'Work in progress', g: 'g-continuous', v: 'construction', d: 'hotel' },
      { t: 'Plans and comparisons', g: 'g-future', v: 'work', d: 'bank', g2: 'g-compare' }
    ],
    B1: [
      { t: 'Rules and advice on site', g: 'g-modals', v: 'construction', d: 'phone' },
      { t: 'Experience and results', g: 'g-presperfect', v: 'hvac', d: 'doctor', r: 'r3' },
      { t: 'If… then…', g: 'g-conditionals', v: 'fire', d: 'social' },
      { t: 'Reports and specifications', g: 'g-passive', v: 'plumbing', d: 'meeting', g2: 'g-linking' }
    ],
    B2: [
      { t: 'Talking like a native', g: 'g-phrasal', v: 'pm', d: 'meeting' },
      { t: 'Precise descriptions', g: 'g-relative', v: 'electrical', d: 'phone', r: 'r4' },
      { t: 'Reporting meetings', g: 'g-reported', v: 'pm', d: 'meeting' }
    ],
    C1: [
      { t: 'Diplomatic & formal English', g: 'g-advanced', v: 'advanced', d: 'meeting', r: 'r5' },
      { t: 'Contracts and claims', g: 'g-advanced', v: 'pm', d: 'meeting' }
    ],
    C2: [
      { t: 'Nuance and precision', g: 'g-nuance', v: 'advanced', d: 'meeting', r: 'r5' }
    ]
  };

  /* ---------------- Badges ---------------- */
  const BADGES = [
    { id: 'first', icon: '🌱', name: 'First step', ar: 'الخطوة الأولى', test: s => s.xp > 0 },
    { id: 'placed', icon: '🎯', name: 'Level found', ar: 'تحديد المستوى', test: s => !!s.level },
    { id: 'streak3', icon: '🔥', name: '3-day streak', ar: '3 أيام متتالية', test: s => s.streak >= 3 },
    { id: 'streak7', icon: '⚡', name: '7-day streak', ar: 'أسبوع متواصل', test: s => s.streak >= 7 },
    { id: 'streak30', icon: '🏆', name: '30-day streak', ar: 'شهر متواصل', test: s => s.streak >= 30 },
    { id: 'words50', icon: '📚', name: '50 words', ar: '50 كلمة', test: s => Object.keys(s.srs).length >= 50 },
    { id: 'words150', icon: '🧠', name: '150 words', ar: '150 كلمة', test: s => Object.keys(s.srs).length >= 150 },
    { id: 'grammar5', icon: '✍️', name: 'Grammar x5', ar: '5 دروس قواعد', test: s => Object.keys(s.grammarDone).length >= 5 },
    { id: 'talk', icon: '💬', name: 'First conversation', ar: 'أول محادثة', test: s => s.stats.conversations >= 1 },
    { id: 'site', icon: '🦺', name: 'Site talker', ar: 'محاور الموقع', test: s => s.stats.siteSims >= 1 },
    { id: 'interview', icon: '🤝', name: 'Interview ready', ar: 'جاهز للمقابلة', test: s => s.stats.interviews >= 1 },
    { id: 'email', icon: '📧', name: 'Email pro', ar: 'محترف الإيميلات', test: s => s.stats.emails >= 3 },
    { id: 'xp1000', icon: '💎', name: '1000 XP', ar: '1000 نقطة', test: s => s.xp >= 1000 }
  ];

  const ALL_WORDS = VOCAB_SETS.flatMap(s => s.words);

  return { LEVELS, GRAMMAR, TENSES, VOCAB_SETS, ALL_WORDS, DIALOGUES, SITE_ROLES, SITE_SCENARIOS, INTERVIEW_ROLES, BUSINESS, EMAILS, READINGS, PRONUNCIATION, PLACEMENT, PLACEMENT_READING, UNITS, BADGES };
})();
