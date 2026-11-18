/* ============================================================
   SiteSpeak — Advanced content pack (C1 / C2)
   Adds grammar lessons, vocabulary sets, readings and level units
   to window.CONTENT. Loaded after content.js, before app.js.
   ============================================================ */
(function () {
  'use strict';
  const C = window.CONTENT; if (!C) return;
  const V = (arr, set, level) => arr.map(w => ({ en: w[0], ar: w[1], def: w[2], ex: w[3], syn: w[4] || '', ant: w[5] || '', set, level }));

  /* ---------------- Grammar: C1 ---------------- */
  const GRAMMAR = [
    { id: 'g-cleft', level: 'C1', title: 'Cleft sentences & emphasis', ar: 'جمل التأكيد (Cleft)',
      explain: 'لتسليط الضوء على معلومة واحدة في الاجتماع أو التقرير: It was … that … / What … is … . بدل "The late approval caused the delay" نقول "It was the late approval that caused the delay" — فيفهم السامع فوراً أين المشكلة.',
      rules: ['It was the late approval that caused the delay.', 'What we need is a revised programme.', 'What the consultant rejected was the pipe material, not the route.', 'It is the fire pump that must be tested first.', 'All we are asking for is a clear decision.'],
      ex: [
        ['mc', '___ was the supplier that delayed the delivery.', ['It', 'What', 'There'], 0, 'It was + الشيء المؤكَّد + that…'],
        ['mc', 'What we need ___ a decision by Sunday.', ['are', 'is', 'be'], 1, 'What … is …: الفعل مفرد.'],
        ['mc', 'Which sentence emphasises "the client"?', ['The client changed the layout.', 'It was the client who changed the layout.', 'The layout was changed.'], 1, 'It was + شخص + who…'],
        ['mc', '___ I am concerned about is the access for maintenance.', ['That', 'What', 'Which'], 1, 'What I am concerned about is…'],
        ['fill', 'It was the chiller ___ failed during testing. (that/what)', 'that', null, 'It was … that …']
      ] },
    { id: 'g-nominal', level: 'C1', title: 'Nominalisation for reports', ar: 'التحويل إلى أسماء في التقارير',
      explain: 'التقارير الرسمية تحوّل الأفعال إلى أسماء فتصبح أقصر وأكثر موضوعية: "We installed the ducts late, so we delayed the ceiling" ← "Late installation of ductwork resulted in a delay to ceiling works." الأنماط الشائعة: install→installation, approve→approval, fail→failure, delay→delay.',
      rules: ['The approval of the shop drawings is pending.', 'Failure to submit the notice may result in loss of entitlement.', 'The installation of sprinkler pipes was completed on Level 4.', 'There has been a significant reduction in rework.', 'Coordination of services is the main priority.'],
      ex: [
        ['mc', 'Choose the more formal version:', ['They approved it late, so we started late.', 'Late approval resulted in a delayed start.', 'It was late and we were late.'], 1, 'الاسم approval بدل الفعل approved.'],
        ['mc', 'The ___ of the pump was due to a faulty seal.', ['fail', 'failure', 'failed'], 1, 'fail → failure.'],
        ['mc', '___ to comply with the specification will lead to rejection.', ['Fail', 'Failing of', 'Failure'], 2, 'Failure to + فعل.'],
        ['mc', 'We need the client\'s ___ before we proceed.', ['approve', 'approval', 'approving of'], 1, 'approve → approval.'],
        ['fill', 'The ___ of the fire alarm system took three days. (install)', 'installation', null, 'install → installation.']
      ] },
    { id: 'g-participle', level: 'C1', title: 'Participle clauses', ar: 'جمل اسم الفاعل والمفعول (Participle clauses)',
      explain: 'لربط فكرتين بجملة واحدة أنيقة بدون and/because/after. -ing للفعل النشط، -ed للمبني للمجهول، Having + p.p. للحدث الذي تم أولاً. انتبه: الفاعل في الجزأين يجب أن يكون واحداً.',
      rules: ['Having reviewed the drawings, we found three clashes.', 'Installed without supports, the pipe started to sag.', 'Working closely with the consultant, we closed all comments in a week.', 'Not having received the approval, we could not start.', 'The ducts, delivered last week, are stored on Level 2.'],
      ex: [
        ['mc', '___ the test results, the engineer approved the system.', ['Having checked', 'Checked', 'Have checked'], 0, 'Having + p.p. = بعد أن…'],
        ['mc', '___ in 2015, the building needs a new fire alarm panel.', ['Building', 'Built', 'Having built'], 1, 'مبني للمجهول → p.p.'],
        ['mc', '___ the approval, we could not order the material.', ['Not having received', 'Having not receive', 'No receiving'], 0, 'النفي: Not having + p.p.'],
        ['mc', 'Which sentence is correct?', ['Walking on site, the duct fell.', 'Walking on site, I noticed a leaking valve.', 'Walking on site, a leak was noticed.'], 1, 'الفاعل نفسه في الجزأين (I).'],
        ['fill', '___ finished the inspection, the consultant signed the IR. (Having/Have)', 'Having', null, 'Having finished = After he had finished.']
      ] },

    /* ---------------- Grammar: C2 ---------------- */
    { id: 'g-modalperfect', level: 'C2', title: 'Speculating about the past', ar: 'الاستنتاج عن الماضي (must have / can\'t have)',
      explain: 'في تحليل الأعطال والتحقيقات: must have + p.p. (متأكد أنه حدث)، can\'t / couldn\'t have (مستحيل أنه حدث)، might / may / could have (ربما). وللمعاتبة: should have (كان يجب)، needn\'t have (فعلته ولم يكن ضرورياً).',
      rules: ['The valve must have been left closed during the test.', 'The pump can\'t have been commissioned — the breaker is still off.', 'The leak might have started at the coupling.', 'The contractor should have notified us within 28 days.', 'We needn\'t have ordered so many fittings.'],
      ex: [
        ['mc', 'The pressure dropped overnight. There ___ a leak.', ['must have been', 'should have been', 'needn\'t have been'], 0, 'استنتاج قوي → must have.'],
        ['mc', 'He ___ approved it — he was on leave all week.', ['must have', 'can\'t have', 'should have'], 1, 'مستحيل → can\'t have.'],
        ['mc', 'You ___ informed us earlier; now it\'s too late.', ['should have', 'must have', 'might have'], 0, 'لوم على الماضي → should have.'],
        ['mc', 'We ___ hired a crane; the forklift was enough.', ['mustn\'t have', 'needn\'t have', 'can\'t have'], 1, 'فعلناه بلا داعٍ → needn\'t have.'],
        ['fill', 'The alarm ___ have been triggered by dust. (might/must — not sure)', 'might', null, 'احتمال → might have.']
      ] },
    { id: 'g-discourse', level: 'C2', title: 'Concession & precise discourse markers', ar: 'أدوات الاستدراك والربط الدقيقة',
      explain: 'المستوى C2 يتطلب ربطاً دقيقاً: albeit (وإن كان)، insofar as (بقدر ما)، granted that (صحيح أن)، be that as it may (ومع ذلك)، let alone (ناهيك عن)، inasmuch as (حيث إن). استعملها بقلة وفي مكانها.',
      rules: ['The design is acceptable, albeit with minor comments.', 'Granted that the delay was not your fault, notice was still required.', 'We cannot meet the original date, let alone an earlier one.', 'Insofar as the contract is silent, the specification prevails.', 'Be that as it may, the works must be completed by June.'],
      ex: [
        ['mc', 'The proposal was approved, ___ with conditions.', ['albeit', 'despite', 'although of'], 0, 'albeit + اسم/صفة = وإن كان.'],
        ['mc', 'We can\'t finish Level 3 this week, ___ the whole tower.', ['let alone', 'as well as', 'in addition'], 0, 'let alone = ناهيك عن.'],
        ['mc', '___ the material was late, the contractor should have mitigated the impact.', ['Granted that', 'Due to', 'Despite of'], 0, 'Granted that + جملة = صحيح أن…'],
        ['mc', 'Choose the correct meaning of "Be that as it may":', ['Therefore', 'Nevertheless', 'For example'], 1, 'Be that as it may ≈ Nevertheless.'],
        ['fill', 'The scope is clear ___ as it relates to MEP works. (insofar)', 'insofar', null, 'insofar as = بقدر ما / فيما يخص.']
      ] },
    { id: 'g-ellipsis', level: 'C2', title: 'Ellipsis & substitution', ar: 'الحذف والاستبدال لتجنب التكرار',
      explain: 'المتحدث المتمكن لا يكرر: يحذف ما هو مفهوم أو يستبدله بـ so / not / do / one. "Will the system be ready?" — "I hope so / I\'m afraid not." "The old valve leaked; the new one doesn\'t."',
      rules: ['Will it pass the test? — I expect so.', 'Is the area handed over? — I\'m afraid not.', 'The old pump was noisy, but the new one isn\'t.', 'We were asked to resubmit, and we did (so).', 'Some panels were approved; others weren\'t.'],
      ex: [
        ['mc', 'Will the consultant attend? — I think ___.', ['it', 'so', 'yes'], 1, 'I think so.'],
        ['mc', 'Is the drawing approved? — I\'m afraid ___.', ['no', 'not', 'don\'t'], 1, 'I\'m afraid not.'],
        ['mc', 'This damper is faulty; please replace it with a new ___.', ['one', 'it', 'that'], 0, 'one بدل اسم معدود مفرد.'],
        ['mc', 'They said they would finish on time, and they ___.', ['finished', 'did', 'were'], 1, 'did بدل تكرار الفعل.'],
        ['fill', 'Some samples were approved; others ___ not. (be)', 'were', null, 'others were not (approved).']
      ] }
  ];

  /* ---------------- Vocabulary ---------------- */
  const SETS = [
    { id: 'negotiation', title: 'Negotiation & presentations', ar: 'التفاوض والعروض التقديمية', level: 'C1', words: V([
      ['concession', 'تنازل', 'something you agree to give up in a negotiation', 'We made a concession on the payment terms.', 'compromise'],
      ['counter-offer', 'عرض مقابل', 'a new offer made in reply to another offer', 'The supplier sent a counter-offer within a day.'],
      ['mandate', 'تفويض / صلاحية', 'official authority to act or decide', 'I have a mandate to agree up to 5%.', 'authority'],
      ['non-negotiable', 'غير قابل للتفاوض', 'cannot be changed or discussed', 'Fire safety requirements are non-negotiable.', 'fixed', 'flexible'],
      ['trade-off', 'مقايضة / موازنة', 'accepting less of one thing to get more of another', 'There is a trade-off between cost and lead time.'],
      ['bottom line', 'الحد الأدنى / الخلاصة', 'the lowest acceptable figure, or the main point', 'Our bottom line is a 10% discount.'],
      ['common ground', 'أرضية مشتركة', 'points both sides agree on', 'Let\'s start with the common ground.'],
      ['deadlock', 'طريق مسدود', 'situation where no agreement is possible', 'The meeting ended in deadlock.', 'stalemate', 'breakthrough'],
      ['outline', 'يوضح الخطوط العريضة', 'describe the main points', 'Let me outline the three options.', 'summarise'],
      ['elaborate', 'يشرح بالتفصيل', 'give more detail', 'Could you elaborate on the risks?', 'expand on'],
      ['compelling', 'مقنع جداً', 'very convincing', 'The data makes a compelling case for VRF.', 'convincing', 'weak'],
      ['viable', 'قابل للتطبيق', 'able to work successfully', 'Option B is the only viable solution.', 'feasible', 'unworkable'],
      ['drawback', 'عيب / سلبية', 'a disadvantage', 'The main drawback is the higher energy cost.', 'downside', 'advantage'],
      ['tentative', 'مبدئي', 'not final or certain', 'We agreed a tentative date of 15 May.', 'provisional', 'definite'],
      ['reconcile', 'يوفّق / يطابق', 'make two things agree', 'We need to reconcile the two BOQs.'],
      ['articulate', 'يعبّر بوضوح', 'express ideas clearly', 'She articulated the client\'s concerns well.'],
      ['take on board', 'يأخذ بعين الاعتبار', 'accept and consider an idea', 'We will take your comments on board.', 'consider', 'ignore'],
      ['in a nutshell', 'باختصار', 'in very few words', 'In a nutshell, the design works but costs more.', 'briefly'],
      ['win-win', 'مكسب للطرفين', 'good for both sides', 'We are looking for a win-win solution.'],
      ['follow up on', 'يتابع', 'take further action about something', 'I will follow up on the open items tomorrow.']
    ], 'negotiation', 'C1') },
    { id: 'precision', title: 'Contract & legal precision', ar: 'الصياغة التعاقدية الدقيقة', level: 'C2', words: V([
      ['hereby', 'بموجب هذا', 'by means of this document (formal)', 'We hereby give notice of a claim.'],
      ['thereof', 'منه / من ذلك', 'of the thing just mentioned (formal)', 'The works and any part thereof.'],
      ['indemnify', 'يعوّض / يحمي من المسؤولية', 'promise to pay for loss or damage', 'The Contractor shall indemnify the Employer.', 'compensate'],
      ['liability', 'مسؤولية قانونية', 'legal responsibility for something', 'Liability is capped at the contract value.'],
      ['precedent', 'سابقة', 'an earlier case used as an example', 'This variation sets a precedent.'],
      ['condition precedent', 'شرط مسبق', 'something that must happen before a right exists', 'Timely notice is a condition precedent to the claim.'],
      ['ambiguity', 'غموض / التباس', 'more than one possible meaning', 'Any ambiguity shall be clarified by the Engineer.', 'vagueness', 'clarity'],
      ['construe', 'يفسّر', 'interpret the meaning of', 'The clause should be construed narrowly.', 'interpret'],
      ['prevail', 'يسود / تكون له الأولوية', 'be stronger or take priority', 'The specification shall prevail over the drawings.', 'take precedence'],
      ['waive', 'يتنازل عن', 'choose not to use a right', 'The Employer did not waive its right to LDs.', 'give up', 'enforce'],
      ['onerous', 'مُرهِق / شاق', 'involving heavy obligations', 'The testing regime is unusually onerous.', 'burdensome', 'easy'],
      ['tantamount to', 'بمثابة', 'equal in effect to', 'The instruction is tantamount to a variation.', 'equivalent to'],
      ['unequivocal', 'قاطع / لا لبس فيه', 'completely clear', 'We require an unequivocal confirmation.', 'unambiguous', 'vague'],
      ['inherent', 'متأصل / كامن', 'existing as a natural part of something', 'There are inherent risks in fast-track projects.', 'intrinsic'],
      ['culpable', 'مُلام / مسؤول عن الخطأ', 'deserving blame', 'Neither party is culpable for the flood.', 'to blame', 'innocent'],
      ['concurrent delay', 'تأخير متزامن', 'two delays happening at the same time from different parties', 'The EOT was reduced due to concurrent delay.'],
      ['disruption', 'إرباك / تعطيل', 'loss of productivity without overall delay', 'We are claiming for disruption, not delay.'],
      ['quantum', 'قيمة المطالبة', 'the amount of money claimed', 'Entitlement is agreed; quantum is still disputed.'],
      ['de minimis', 'ضئيل لا يُعتد به', 'too small to be important', 'The deviation is de minimis.', 'negligible', 'significant'],
      ['mutatis mutandis', 'مع مراعاة التعديلات اللازمة', 'with the necessary changes made', 'Clause 8 applies mutatis mutandis to subcontracts.']
    ], 'precision', 'C2') }
  ];

  /* ---------------- Readings ---------------- */
  const READINGS = [
    { id: 'r6', level: 'C1', title: 'Value Engineering Without Losing Value',
      text: 'Value engineering is often misunderstood as a polite term for cost cutting. In practice, a genuine value engineering exercise asks a broader question: can the same function be delivered at a lower whole-life cost? Replacing a chilled-water system with a cheaper split-unit solution may reduce the capital cost, but if it doubles maintenance, shortens equipment life and increases energy consumption, the client has lost value rather than gained it. For this reason, experienced consultants insist that every proposal be supported by a life-cycle cost comparison rather than a single purchase price. They also check whether the alternative still complies with the specification and the authority requirements, since a saving that triggers a re-submission to Civil Defense may cost more in time than it saves in money. Handled well, value engineering builds trust between contractor and client; handled badly, it is remembered as the moment quality was sacrificed.',
      q: [['According to the passage, value engineering should focus on…', ['the lowest purchase price', 'delivering the same function at a lower whole-life cost', 'removing systems from the design'], 1],
          ['Why might a cheaper split-unit solution reduce value?', ['It is always illegal', 'It may raise maintenance and energy costs', 'It needs no approval'], 1],
          ['What can make a "saving" more expensive in the end?', ['A life-cycle cost study', 'A required re-submission to the authorities', 'A trusted contractor'], 1]] },
    { id: 'r7', level: 'C2', title: 'Design Responsibility and the Fitness-for-Purpose Trap',
      text: 'Few clauses generate more dispute than those allocating design responsibility. Where a contractor undertakes to design part of the works, the standard of care is ordinarily that of a reasonably competent designer: the contractor must exercise reasonable skill and care, but does not guarantee the result. A fitness-for-purpose obligation is altogether more onerous. Under such a clause, the contractor is liable if the completed system fails to achieve its stated purpose, irrespective of whether any negligence can be shown. Contractors who accept performance specifications — a smoke-extract system that must clear a defined volume within a defined time, for instance — may therefore assume a strict liability that their professional indemnity insurance does not cover, since such policies typically respond only to negligence. The prudent course is to read the employer\'s requirements in their entirety, identify any performance criteria that amount to a guarantee, and either price the risk explicitly or negotiate the obligation down to reasonable skill and care before signing.',
      q: [['What is the usual standard for a contractor who designs part of the works?', ['A guarantee of the result', 'Reasonable skill and care', 'No responsibility at all'], 1],
          ['Why is fitness for purpose described as "more onerous"?', ['It requires proof of negligence', 'The contractor is liable if the result fails, even without negligence', 'It only applies to drawings'], 1],
          ['Why may insurance not protect the contractor?', ['Policies usually cover negligence only', 'Insurance is illegal in construction', 'Smoke-extract systems are excluded by law'], 0]] }
  ];

  /* ---------------- Units ---------------- */
  const UNITS = {
    C1: [
      { t: 'Emphasis in meetings', g: 'g-cleft', v: 'negotiation', d: 'meeting' },
      { t: 'Writing formal reports', g: 'g-nominal', v: 'advanced', d: 'phone', r: 'r6', g2: 'g-participle' }
    ],
    C2: [
      { t: 'Investigating failures', g: 'g-modalperfect', v: 'precision', d: 'meeting' },
      { t: 'Arguing with precision', g: 'g-discourse', v: 'precision', d: 'meeting', r: 'r7', g2: 'g-ellipsis' }
    ]
  };

  /* ---------------- Merge (safe: never duplicates an existing id) ---------------- */
  const hasDlg = id => (C.DIALOGUES || []).some(d => d.id === id);
  GRAMMAR.forEach(g => { if (!C.GRAMMAR.some(x => x.id === g.id)) C.GRAMMAR.push(g); });
  // keep grammar ordered by CEFR level so lists read A1 → C2
  const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  C.GRAMMAR.sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
  SETS.forEach(s => { if (!C.VOCAB_SETS.some(x => x.id === s.id)) { C.VOCAB_SETS.push(s); s.words.forEach(w => { if (!C.ALL_WORDS.some(x => x.en === w.en)) C.ALL_WORDS.push(w); }); } });
  READINGS.forEach(r => { if (!C.READINGS.some(x => x.id === r.id)) C.READINGS.push(r); });
  Object.keys(UNITS).forEach(lv => {
    C.UNITS[lv] = C.UNITS[lv] || [];
    UNITS[lv].forEach(u => { if (!hasDlg(u.d)) u.d = (C.DIALOGUES[0] || {}).id; if (!C.UNITS[lv].some(x => x.t === u.t)) C.UNITS[lv].push(u); });
  });

  /* ---------------- Arabic translations of examples + pronunciation ---------------- */
  window.EX_AR = Object.assign(window.EX_AR || {}, {
    'concession': 'قدّمنا تنازلاً في شروط الدفع.', 'counter-offer': 'أرسل المورّد عرضاً مقابلاً خلال يوم.', 'mandate': 'لديّ صلاحية للموافقة حتى 5%.',
    'non-negotiable': 'متطلبات السلامة من الحريق غير قابلة للتفاوض.', 'trade-off': 'هناك موازنة بين التكلفة ومدة التوريد.', 'bottom line': 'حدّنا الأدنى خصم 10%.',
    'common ground': 'لنبدأ بالنقاط المتفق عليها.', 'deadlock': 'انتهى الاجتماع إلى طريق مسدود.', 'outline': 'دعني أوضح الخيارات الثلاثة باختصار.',
    'elaborate': 'هل يمكنك شرح المخاطر بالتفصيل؟', 'compelling': 'البيانات تقدّم حجة مقنعة جداً لنظام VRF.', 'viable': 'الخيار B هو الحل الوحيد القابل للتطبيق.',
    'drawback': 'العيب الأساسي هو ارتفاع تكلفة الطاقة.', 'tentative': 'اتفقنا مبدئياً على تاريخ 15 مايو.', 'reconcile': 'نحتاج لمطابقة جدولي الكميات.',
    'articulate': 'عبّرت عن مخاوف العميل بوضوح.', 'take on board': 'سنأخذ ملاحظاتكم بعين الاعتبار.', 'in a nutshell': 'باختصار، التصميم يعمل لكنه أغلى.',
    'win-win': 'نبحث عن حل يكسب فيه الطرفان.', 'follow up on': 'سأتابع البنود المفتوحة غداً.',
    'hereby': 'نُخطركم بموجب هذا بمطالبة.', 'thereof': 'الأعمال وأي جزء منها.', 'indemnify': 'يلتزم المقاول بتعويض صاحب العمل.',
    'liability': 'المسؤولية محدودة بقيمة العقد.', 'precedent': 'هذا الأمر التغييري يُنشئ سابقة.', 'condition precedent': 'الإخطار في الوقت المحدد شرط مسبق للمطالبة.',
    'ambiguity': 'أي غموض يوضّحه المهندس.', 'construe': 'يجب تفسير البند بشكل ضيق.', 'prevail': 'المواصفات لها الأولوية على المخططات.',
    'waive': 'لم يتنازل صاحب العمل عن حقه في غرامات التأخير.', 'onerous': 'نظام الاختبارات مرهق بشكل غير معتاد.', 'tantamount to': 'التعليمات بمثابة أمر تغييري.',
    'unequivocal': 'نطلب تأكيداً قاطعاً.', 'inherent': 'توجد مخاطر كامنة في المشاريع سريعة التنفيذ.', 'culpable': 'لا يتحمل أي طرف اللوم عن الفيضان.',
    'concurrent delay': 'تم تقليل التمديد بسبب تأخير متزامن.', 'disruption': 'نطالب بتعويض عن الإرباك وليس التأخير.', 'quantum': 'تم الاتفاق على الاستحقاق، والقيمة ما زالت محل خلاف.',
    'de minimis': 'الانحراف ضئيل لا يُعتد به.', 'mutatis mutandis': 'يُطبَّق البند 8 على عقود الباطن مع التعديلات اللازمة.'
  });
  window.PRON_AR = Object.assign(window.PRON_AR || {}, {
    'concession': 'كَنْسِيشِن', 'mandate': 'ماندِيت', 'counter-offer': 'كاونْتَر أوفَر', 'non-negotiable': 'نون نِگوشيابِل', 'trade-off': 'تريد أوف', 'bottom line': 'بوتَم لاين',
    'common ground': 'كومَن گراوْنْد', 'deadlock': 'دِدْلوك', 'outline': 'آوْتْلاين', 'elaborate': 'إلابَرِيت', 'compelling': 'كَمْپِلِنْگ',
    'viable': 'ڤايابِل', 'drawback': 'دْروباك', 'tentative': 'تِنْتَتِڤ', 'reconcile': 'رِكَنْسايِل', 'articulate': 'آرْتِكْيُولِيت',
    'take on board': 'تيك أون بورْد', 'in a nutshell': 'إن أ نَتْشِل', 'win-win': 'وِن وِن', 'follow up on': 'فولو أپ أون',
    'hereby': 'هِيرْباي', 'thereof': 'ذِيرْأوڤ', 'indemnify': 'إنْدِمْنِفاي', 'liability': 'لايَبِلِتي', 'precedent': 'پْرِسِدِنْت',
    'condition precedent': 'كَنْدِيشِن پْرِسيدِنْت', 'ambiguity': 'أَمْبِگْيُوِتي', 'construe': 'كَنْسْترو', 'prevail': 'پْرِڤيل', 'waive': 'ويڤ',
    'onerous': 'أونَرَس', 'tantamount to': 'تانْتَماوْنْت تو', 'unequivocal': 'أَنِكْوِڤَكِل', 'inherent': 'إنْهيرِنْت', 'culpable': 'كَلْپَبِل',
    'concurrent delay': 'كَنْكَرِنْت دِلِيه', 'disruption': 'دِسْرَپْشِن', 'quantum': 'كْوونْتَم', 'de minimis': 'دي مِنِمِس', 'mutatis mutandis': 'ميوتاتِس ميوتانْدِس'
  });
})();
