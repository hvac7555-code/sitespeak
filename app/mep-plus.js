/* ============================================================
   MEP Plus — extra professional sets and site documents.
   Adds to window.CONTENT (vocabulary sets + email/document templates),
   window.PRON_AR (Arabic-script pronunciation) and window.EX_AR
   (Arabic translation of each example sentence).
   Loaded after content.js / advanced-content.js, before app.js.
   ============================================================ */
(function () {
  const C = window.CONTENT; if (!C) return;
  const PA = window.PRON_AR = window.PRON_AR || {};
  const EX = window.EX_AR = window.EX_AR || {};

  // [en, ar, definition, example, Arabic pronunciation, Arabic example]
  const SETS = [
    {
      id: 'tnc', title: 'Testing & Commissioning', ar: 'الاختبار والتشغيل', level: 'B2', words: [
        ['pre-commissioning', 'ما قبل التشغيل', 'checks done before a system is started for the first time', 'Pre-commissioning checks for the chillers are complete.', 'پري-كوميشِنِنْج', 'فحوصات ما قبل تشغيل التشيلرات اكتملت.'],
        ['commissioning', 'التشغيل والاختبار', 'starting a system and proving it works as designed', 'Commissioning of the fire pumps is planned for Sunday.', 'كوميشِنِنْج', 'تشغيل طلمبات الحريق مخطط له يوم الأحد.'],
        ['start-up', 'التشغيل الأول', 'the first time equipment is switched on under control', 'The vendor will attend the start-up of the generator.', 'سْتارْت-أپ', 'المورّد هيحضر التشغيل الأول للمولد.'],
        ['witness test', 'اختبار بحضور الاستشاري', 'a test watched and signed by the consultant or client', 'Please confirm your availability for the witness test.', 'ويتْنِس تِسْت', 'برجاء تأكيد حضورك لاختبار المعاينة.'],
        ['pressure test', 'اختبار الضغط', 'filling pipes under pressure to prove there are no leaks', 'The pressure test held 15 bar for two hours.', 'پْرِيشَر تِسْت', 'اختبار الضغط ثبت على 15 بار لمدة ساعتين.'],
        ['air balancing', 'موازنة الهواء', 'adjusting dampers so each outlet gets its design airflow', 'Air balancing on Level 4 is 80% complete.', 'إير بالانْسِنْج', 'موازنة الهواء في الدور الرابع خلصت 80%.'],
        ['water balancing', 'موازنة المياه', 'adjusting valves so each coil gets its design water flow', 'Water balancing needs the balancing valves fully installed.', 'ووتَر بالانْسِنْج', 'موازنة المياه محتاجة محابس الموازنة تكون متركبة بالكامل.'],
        ['design flow rate', 'معدل التدفق التصميمي', 'the flow the designer specified for a piece of equipment', 'The measured flow is 5% below the design flow rate.', 'دِزايْن فْلو ريْت', 'التدفق المقاس أقل من التصميمي بـ 5%.'],
        ['insulation resistance', 'مقاومة العزل', 'how well cable insulation stops current leaking', 'Insulation resistance was above 100 megohms on all circuits.', 'إنْسيوليْشَن رِزِسْتَنْس', 'مقاومة العزل كانت فوق 100 ميجا أوم في كل الدوائر.'],
        ['continuity test', 'اختبار الاستمرارية', 'checking a conductor is connected end to end', 'The continuity test on the earthing conductors passed.', 'كونْتِنْيوِتي تِسْت', 'اختبار الاستمرارية لموصلات الأرضي نجح.'],
        ['functional test', 'اختبار وظيفي', 'checking that the system does what it should in operation', 'The functional test of the smoke dampers is tomorrow.', 'فَنْكْشَنال تِسْت', 'الاختبار الوظيفي لدامبرات الدخان بكرة.'],
        ['cause and effect matrix', 'مصفوفة السبب والنتيجة', 'table showing what each fire alarm input must trigger', 'We tested every line of the cause and effect matrix.', 'كوز آنْد إفِكْت ميْتْرِكْس', 'اختبرنا كل سطر في مصفوفة السبب والنتيجة.'],
        ['integrated systems test', 'الاختبار المتكامل للأنظمة', 'a test of all life-safety systems working together', 'The integrated systems test needs fire alarm, BMS and lifts.', 'إنْتِجْريْتِد سِسْتِمْز تِسْت', 'الاختبار المتكامل محتاج إنذار الحريق والـ BMS والمصاعد.'],
        ['test sheet', 'نموذج الاختبار', 'the form where test results are recorded and signed', 'Attach the signed test sheets to the WIR.', 'تِسْت شيت', 'أرفق نماذج الاختبار الموقّعة مع طلب الاستلام.'],
        ['snag', 'ملاحظة / عيب بسيط', 'a small defect found during inspection', 'Close all snags before the final inspection.', 'سْناج', 'اقفل كل الملاحظات قبل الاستلام النهائي.'],
        ['O&M manual', 'كتيب التشغيل والصيانة', 'documents explaining how to operate and maintain equipment', 'Submit the O&M manuals two weeks before handover.', 'أو آنْد إم مانْيوال', 'قدّم كتيبات التشغيل والصيانة قبل التسليم بأسبوعين.'],
        ['training session', 'جلسة تدريب', 'teaching the client staff how to operate the systems', 'The training session for the facility team is on Monday.', 'تْريْنِنْج سِشَن', 'تدريب فريق الصيانة يوم الاتنين.'],
        ['handover', 'التسليم', 'formally passing the finished works to the client', 'Handover of Block B is planned for March.', 'هانْد-أوڤَر', 'تسليم المبنى B مخطط له في مارس.']
      ]
    },
    {
      id: 'bms', title: 'BMS & Controls', ar: 'أنظمة التحكم والمراقبة', level: 'B2', words: [
        ['controller', 'وحدة تحكم', 'device that reads sensors and controls equipment', 'The AHU controller is not responding.', 'كونْتْرولَر', 'وحدة تحكم وحدة مناولة الهواء مش بتستجيب.'],
        ['DDC panel', 'لوحة تحكم رقمي', 'panel with direct digital controllers for a plant room', 'The DDC panel in the plant room needs power.', 'دي دي سي پانِل', 'لوحة التحكم في غرفة المعدات محتاجة كهربا.'],
        ['sensor', 'حساس', 'device that measures temperature, pressure, humidity etc.', 'Relocate the temperature sensor away from the diffuser.', 'سِنْسَر', 'انقل حساس الحرارة بعيد عن مخرج الهواء.'],
        ['actuator', 'مشغّل / محرك', 'motor that opens or closes a valve or damper', 'The valve actuator is wired but not calibrated.', 'آكْتْشوِيْتَر', 'محرك المحبس متوصّل بس مش متظبط.'],
        ['set point', 'القيمة المضبوطة', 'the target value the control system tries to keep', 'Change the set point to 23 °C.', 'سِت پوينْت', 'غيّر القيمة المضبوطة لـ 23 درجة.'],
        ['points list', 'قائمة النقاط', 'list of every input and output the BMS monitors or controls', 'The points list must match the approved I/O schedule.', 'پوينْتْس لِسْت', 'قائمة النقاط لازم تطابق جدول المداخل والمخارج المعتمد.'],
        ['interface', 'ربط / واجهة', 'connection between two systems so they share data', 'The fire alarm interface to the BMS is complete.', 'إنْتَرْفيْس', 'ربط إنذار الحريق بالـ BMS خلص.'],
        ['protocol', 'بروتوكول اتصال', 'the language two systems use to talk (BACnet, Modbus)', 'The chiller uses the BACnet protocol.', 'پْروتوكول', 'التشيلر بيستخدم بروتوكول BACnet.'],
        ['alarm', 'إنذار / تنبيه', 'a message that something is wrong', 'The BMS shows a high-temperature alarm in the server room.', 'ألارْم', 'الـ BMS بيظهر إنذار حرارة عالية في غرفة السيرفرات.'],
        ['trend log', 'سجل القراءات', 'record of a value over time', 'Send me the trend log for the last 24 hours.', 'تْرِنْد لوج', 'ابعتلي سجل القراءات لآخر 24 ساعة.'],
        ['schedule', 'جدول التشغيل', 'times when equipment runs automatically', 'The AHUs follow the office schedule, 7 am to 7 pm.', 'سْكِجول', 'وحدات مناولة الهواء بتشتغل على جدول المكاتب من 7 الصبح لـ 7 بالليل.'],
        ['override', 'تجاوز يدوي', 'manually forcing equipment on or off against the program', 'Remove the manual override after the test.', 'أوڤَرْرايْد', 'شيل التجاوز اليدوي بعد الاختبار.'],
        ['graphics', 'الشاشات الرسومية', 'screens showing the systems and live values', 'The graphics for Level 3 are not updated yet.', 'جْرافِكْس', 'شاشات الدور التالت لسه ما اتحدّثتش.'],
        ['VFD (variable frequency drive)', 'مغير السرعة', 'device that changes motor speed to save energy', 'The VFD keeps the pump at 70% speed.', 'ڤي إف دي', 'مغير السرعة مخلّي الطلمبة على 70% من سرعتها.'],
        ['loop tuning', 'ضبط حلقة التحكم', 'adjusting the control loop so it is stable and fast', 'Loop tuning is needed; the valve keeps hunting.', 'لوپ تْيونِنْج', 'محتاجين نضبط حلقة التحكم؛ المحبس فضل يفتح ويقفل.']
      ]
    },
    {
      id: 'hse', title: 'Site Safety (HSE)', ar: 'السلامة في الموقع', level: 'B1', words: [
        ['PPE', 'معدات الوقاية الشخصية', 'personal protective equipment: helmet, boots, vest, gloves', 'No one enters the site without full PPE.', 'پي پي إي', 'محدش يدخل الموقع من غير معدات الوقاية كاملة.'],
        ['permit to work (PTW)', 'تصريح عمل', 'written approval needed before risky work starts', 'You need a permit to work for hot works in the plant room.', 'پِرْمِت تو وِرْك', 'محتاج تصريح عمل للأعمال الساخنة في غرفة المعدات.'],
        ['hot work', 'أعمال ساخنة', 'welding, cutting or grinding that can start a fire', 'Keep a fire extinguisher next to all hot work.', 'هوت وِرْك', 'خلي طفاية جنب أي أعمال ساخنة.'],
        ['working at height', 'العمل على ارتفاع', 'any work where a person could fall', 'Working at height needs a harness above 1.8 m.', 'وِرْكِنْج آت هايْت', 'العمل على ارتفاع محتاج حزام أمان فوق 1.8 متر.'],
        ['full body harness', 'حزام أمان كامل', 'safety harness that stops a fall', 'Check the harness before each use.', 'فول بودي هارْنِس', 'افحص حزام الأمان قبل كل استخدام.'],
        ['risk assessment', 'تقييم المخاطر', 'document listing hazards and how to control them', 'Attach the risk assessment to the method statement.', 'رِسْك أسِسْمِنْت', 'أرفق تقييم المخاطر مع طريقة التنفيذ.'],
        ['toolbox talk', 'اجتماع توعية قصير', 'short safety briefing before work', 'We hold a toolbox talk every morning at 7.', 'تولْبوكْس توك', 'بنعمل اجتماع توعية كل يوم الساعة 7 الصبح.'],
        ['lockout / tagout (LOTO)', 'العزل والتعليق', 'locking and tagging a power source before maintenance', 'Apply LOTO before opening the panel.', 'لوك-أوت تاج-أوت', 'اعمل عزل وتعليق قبل ما تفتح اللوحة.'],
        ['confined space', 'مكان مغلق', 'tank, pit or shaft with limited entry and air', 'Test the air before entering the confined space.', 'كونْفايْنْد سْپيْس', 'اختبر الهوا قبل ما تدخل المكان المغلق.'],
        ['near miss', 'حادث وشيك', 'an event that almost caused injury', 'Report every near miss to the safety officer.', 'نِير مِس', 'بلّغ مسؤول السلامة عن أي حادث وشيك.'],
        ['incident report', 'تقرير حادث', 'written record of an accident or near miss', 'The incident report must be issued within 24 hours.', 'إنْسِدِنْت رِپورْت', 'تقرير الحادث لازم يطلع خلال 24 ساعة.'],
        ['housekeeping', 'نظافة وترتيب الموقع', 'keeping the work area clean and tidy', 'Poor housekeeping on Level 5 caused a trip.', 'هاوْس-كيپِنْج', 'سوء ترتيب الدور الخامس سبّب إن حد اتكعبل.'],
        ['barricade', 'حاجز', 'barrier that stops people entering a danger area', 'Barricade the open shaft immediately.', 'بارِكيْد', 'اعمل حاجز حوالين الشافت المفتوح فوراً.'],
        ['fire watch', 'مراقب حريق', 'person watching for fire during and after hot work', 'Fire watch stays 30 minutes after welding.', 'فايَر ووتْش', 'مراقب الحريق يفضل 30 دقيقة بعد اللحام.'],
        ['assembly point', 'نقطة التجمع', 'safe place where everyone gathers in an emergency', 'In case of alarm, go to assembly point B.', 'أسِمْبْلي پوينْت', 'لو حصل إنذار، روح نقطة التجمع B.'],
        ['scaffold tag', 'بطاقة السقالة', 'green/red tag showing if a scaffold is safe to use', 'Do not use a scaffold with a red tag.', 'سْكافولْد تاج', 'متستخدمش سقالة عليها بطاقة حمرا.'],
        ['first aid', 'الإسعافات الأولية', 'immediate help given to an injured person', 'The first aid kit is in the site office.', 'فِرْسْت إيْد', 'شنطة الإسعافات في مكتب الموقع.'],
        ['HSE plan', 'خطة الصحة والسلامة', "the project's health, safety and environment plan", 'All subcontractors must follow the HSE plan.', 'إتْش إس إي پْلان', 'كل مقاولي الباطن لازم يمشوا على خطة السلامة.']
      ]
    },
    {
      id: 'qaqc', title: 'QA/QC & Inspections', ar: 'الجودة والاستلامات', level: 'B2', words: [
        ['WIR (work inspection request)', 'طلب استلام أعمال', 'request for the consultant to inspect finished work', 'We raised a WIR for the chilled water pipes on Level 2.', 'دَبْليو آي آر', 'قدّمنا طلب استلام لمواسير المياه المبردة في الدور التاني.'],
        ['MIR (material inspection request)', 'طلب فحص مواد', 'request to inspect materials delivered to site', 'Raise an MIR as soon as the cables arrive.', 'إم آي آر', 'قدّم طلب فحص مواد أول ما الكابلات توصل.'],
        ['ITP (inspection and test plan)', 'خطة الفحص والاختبار', 'list of inspections and tests for each activity', 'The ITP shows a hold point before insulation.', 'آي تي پي', 'خطة الفحص فيها نقطة توقف قبل العزل.'],
        ['hold point', 'نقطة توقف', 'stage where work must stop until it is inspected', 'Concealing the pipes is a hold point.', 'هولْد پوينْت', 'تغطية المواسير نقطة توقف لازم استلام قبلها.'],
        ['approved', 'معتمد', 'accepted by the consultant with no comments', 'The submittal is approved (Code A).', 'أپْروڤْد', 'التقديم اتعمد كود A.'],
        ['approved as noted', 'معتمد بملاحظات', 'accepted, but the comments must be followed', 'The shop drawing is approved as noted (Code B).', 'أپْروڤْد آز نوتِد', 'رسومات التنفيذ اتعمدت بملاحظات كود B.'],
        ['revise and resubmit', 'يُعدَّل ويُعاد تقديمه', 'rejected; correct it and submit again', 'Code C: revise and resubmit within one week.', 'رِڤايْز آنْد ري-سَبْمِت', 'كود C: عدّل وقدّم تاني خلال أسبوع.'],
        ['compliance statement', 'بيان المطابقة', 'table showing how a product meets the specification', 'Add a compliance statement to the material submittal.', 'كومْپْلايَنْس سْتيْتْمِنْت', 'ضيف بيان مطابقة لتقديم المواد.'],
        ['deviation', 'انحراف / اختلاف', 'where the proposal differs from the specification', 'List every deviation clearly in the submittal.', 'ديڤيْيْشَن', 'اكتب كل اختلاف بوضوح في التقديم.'],
        ['datasheet', 'الكتالوج الفني', 'technical data of a product', 'Highlight the selected model in the datasheet.', 'دِيْتا-شيت', 'علّم على الموديل المختار في الكتالوج.'],
        ['calibration certificate', 'شهادة معايرة', 'proof that a measuring instrument is accurate', 'Attach the calibration certificate of the pressure gauge.', 'كاليبْريْشَن سِرْتِفِكِت', 'أرفق شهادة معايرة عداد الضغط.'],
        ['quality audit', 'تدقيق الجودة', 'formal check that procedures are being followed', 'The client will carry out a quality audit next week.', 'كْواليتي أوديت', 'العميل هيعمل تدقيق جودة الأسبوع الجاي.'],
        ['corrective action', 'إجراء تصحيحي', 'action that fixes a problem that happened', 'The corrective action was completed on Thursday.', 'كورِكْتِڤ آكْشَن', 'الإجراء التصحيحي اتنفذ يوم الخميس.'],
        ['preventive action', 'إجراء وقائي', 'action that stops the problem happening again', 'As a preventive action, QC will check each joint.', 'پْرِڤِنْتِڤ آكْشَن', 'كإجراء وقائي، الجودة هتفحص كل وصلة.'],
        ['site observation', 'ملاحظة موقع', 'note issued by the consultant about work on site', 'We received a site observation about pipe supports.', 'سايْت أوبْزِرْڤيْشَن', 'وصلتنا ملاحظة موقع بخصوص دعامات المواسير.']
      ]
    }
  ];

  const added = [];
  SETS.forEach(s => {
    if (C.VOCAB_SETS.some(x => x.id === s.id)) return;
    const words = s.words.map(w => ({ en: w[0], ar: w[1], def: w[2], ex: w[3], syn: '', ant: '', set: s.id, level: s.level }));
    s.words.forEach(w => { if (!PA[w[0]]) PA[w[0]] = w[4]; if (!EX[w[0]]) EX[w[0]] = w[5]; });
    C.VOCAB_SETS.push({ id: s.id, title: s.title, ar: s.ar, level: s.level, words });
    if (Array.isArray(C.ALL_WORDS)) C.ALL_WORDS.push(...words);
    added.push(s.id);
  });
  C.MEP_PLUS_SETS = added;

  const DOCS = [
    {
      id: 'e-ms', title: 'Method Statement Submission', ar: 'تقديم طريقة تنفيذ',
      body: 'Subject: Submission of Method Statement MS-MEP-014 – Installation of Chilled Water Piping\n\nDear Eng. Khaled,\n\nPlease find attached Method Statement MS-MEP-014 for the installation of chilled water piping, for your review and approval.\n\nThe method statement includes:\n• Scope of work and sequence of activities\n• Manpower, tools and equipment\n• Risk assessment and HSE controls\n• Inspection and test plan (ITP) and hold points\n\nWe kindly request your approval by 20 November so that works can start as planned.\n\nBest regards,\nMohamed\nMEP Engineer'
    },
    {
      id: 'e-tnc', title: 'Request for T&C Witnessing', ar: 'طلب حضور اختبار وتشغيل',
      body: 'Subject: Request for Witnessing – Hydrostatic Test, Fire Fighting Riser FF-R2\n\nDear Eng. Omar,\n\nWe would like to invite you to witness the hydrostatic test of fire fighting riser FF-R2 (Basement to Level 6).\n\nDate: Sunday, 24 November\nTime: 9:00 am\nTest pressure: 15 bar for 2 hours, as per the approved ITP\nLocation: Riser shaft, Core B\n\nThe calibrated pressure gauge certificate and the test sheet are attached.\n\nKindly confirm your attendance.\n\nBest regards,\nMohamed'
    },
    {
      id: 'e-snag', title: 'Response to Snag List', ar: 'الرد على قائمة الملاحظات',
      body: 'Subject: Response to Snag List – Level 3 Offices (HVAC & Plumbing)\n\nDear Eng. Sara,\n\nThank you for the snag list issued on 12 November.\n\nStatus of the 18 snags:\n• 14 snags are closed – photos attached.\n• 3 snags (diffuser alignment) will be closed by 18 November.\n• 1 snag (leak at WC-03) is under investigation with the plumbing subcontractor.\n\nWe will request a joint inspection once all items are closed.\n\nBest regards,\nMohamed'
    },
    {
      id: 'e-si', title: 'Reply to Site Instruction (Variation)', ar: 'الرد على تعليمات موقع (تغيير)',
      body: 'Subject: Site Instruction SI-027 – Additional FCUs in Meeting Rooms\n\nDear Eng. Ahmed,\n\nWe acknowledge receipt of Site Instruction SI-027 requesting two additional FCUs in meeting rooms MR-4 and MR-5.\n\nPlease note that this work is outside our original scope. We will submit the cost and time impact within 7 days, as per the contract.\n\nWe will start the works after your written approval of the variation.\n\nBest regards,\nMohamed'
    }
  ];
  DOCS.forEach(d => { if (!C.EMAILS.some(e => e.id === d.id)) C.EMAILS.push(d); });
})();
