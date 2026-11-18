/* ============================================================
   Arabic-script pronunciation guide (النطق بالحروف العربية)
   Legend:  پ = P   ڤ = V   چ = G (جيم مصرية)   ج = J (جيم معطّشة)
            ث = th في think   ذ = th في this   تش = ch   ش = sh
   The stressed syllable is written in the "stress" helper where useful.
   ============================================================ */
window.PRON_AR = {
  /* daily */
  'schedule': 'سكِجول / شِدْيول', 'appointment': 'أَپوينْتْمِنْت', 'receipt': 'رِسيت', 'change': 'تشِينْج', 'reservation': 'رِزِرْڤيشِن',
  'luggage': 'لَچِدج', 'delay': 'دِلِيه', 'available': 'أَڤِيلابِل', 'expensive': 'إكْسْپِنْسِڤ', 'neighborhood': 'نِيبَرْهود',
  'prescription': 'پْرِسْكْرِپْشِن', 'traffic': 'تْرافِك', 'invite': 'إنْڤايْت', 'borrow': 'بارو', 'refund': 'ريفَنْد',
  'directions': 'دايْرِكْشِنْز', 'comfortable': 'كَمْفْتِبِل', 'quickly': 'كْوِكْلي', 'weekend': 'ويكِنْد', 'bill': 'بِل',
  /* work */
  'deadline': 'دِدْلايْن', 'colleague': 'كاليچ', 'responsible for': 'رِسْپانْسِبِل فور', 'attend': 'أَتِنْد', 'postpone': 'پوسْتْپون',
  'approve': 'أَپْروڤ', 'reject': 'رِجِكْت', 'priority': 'پْرايْأورِتي', 'update': 'أَپْدِيت', 'feedback': 'فيدْباك',
  'issue': 'إشو', 'confirm': 'كَنْفِرْم', 'agenda': 'أَجِنْدا', 'task': 'تاسْك', 'experience': 'إكْسْپيريِنْس',
  'skill': 'سْكِل', 'salary': 'سالَري', 'promotion': 'پْرَموشِن', 'resign': 'رِزايْن', 'handover': 'هانْدوڤَر',
  /* HVAC */
  'chiller': 'تشِلَر', 'chilled water': 'تشِلْد ووتَر', 'AHU (air handling unit)': 'إيه إيتش يو (إير هانْدْلِنْچ يونِت)',
  'FCU (fan coil unit)': 'إف سي يو (فان كويْل يونِت)', 'ductwork': 'دَكْتْوِرْك', 'diffuser': 'دِفْيوزَر', 'return air grille': 'رِتِرْن إير چْرِل',
  'damper': 'دامْپَر', 'fire damper': 'فايَر دامْپَر', 'VAV box': 'ڤي إيه ڤي باكْس', 'fresh air': 'فْرِش إير', 'exhaust fan': 'إچْزوسْت فان',
  'cooling load': 'كولِنْچ لود', 'ton of refrigeration (TR)': 'تَن أوڤ رِفْرِجِرِيشِن (تي آر)', 'refrigerant': 'رِفْرِجِرِنْت',
  'condensate drain': 'كانْدِنْسِيت دْرِيْن', 'insulation': 'إنْسْيولِيشِن', 'static pressure': 'سْتاتِك پْرِشَر',
  'testing and balancing (TAB)': 'تِسْتِنْچ آنْد بالَنْسِنْچ (تي إيه بي)', 'smoke extract': 'سْموك إكْسْتْراكْت',
  'stair pressurization': 'سْتير پْرِشَرايْزِيشِن', 'thermostat': 'ثِرْمَسْتات', 'VRF': 'ڤي آر إف', 'cooling tower': 'كولِنْچ تاوَر', 'BMS': 'بي إم إس',
  /* Fire */
  'fire pump': 'فايَر پَمْپ', 'jockey pump': 'جاكي پَمْپ', 'diesel fire pump': 'ديزِل فايَر پَمْپ', 'sprinkler': 'سْپْرِنْكْلَر',
  'pendent sprinkler': 'پِنْدِنْت سْپْرِنْكْلَر', 'upright sprinkler': 'أَپْرايْت سْپْرِنْكْلَر', 'fire hose cabinet (FHC)': 'فايَر هوز كابِنِت (إف إيتش سي)',
  'landing valve': 'لانْدِنْچ ڤالْڤ', 'fire department connection (FDC)': 'فايَر دِپارْتْمِنْت كَنِكْشِن (إف دي سي)', 'alarm check valve': 'أَلارْم تشِك ڤالْڤ',
  'flow switch': 'فْلو سْوِتْش', 'tamper switch': 'تامْپَر سْوِتْش', 'zone control valve': 'زون كَنْتْرول ڤالْڤ', 'smoke detector': 'سْموك دِتِكْتَر',
  'heat detector': 'هيت دِتِكْتَر', 'manual call point': 'مانْيوَل كول پويْنْت', 'fire alarm control panel (FACP)': 'فايَر أَلارْم كَنْتْرول پانِل (إف إيه سي پي)',
  'sounder / strobe': 'ساوْنْدَر / سْتْروب', 'FM-200': 'إف إم تو هَنْدْرِد', 'hydrostatic test': 'هايْدْرَسْتاتِك تِسْت', 'fire rating': 'فايَر رِيْتِنْچ',
  'civil defense': 'سِڤِل دِفِنْس', 'firestopping': 'فايَرْسْتاپِنْچ', 'hydrant': 'هايْدْرِنْت', 'NFPA': 'إن إف پي إيه',
  /* Plumbing */
  'water supply': 'ووتَر سَپْلاي', 'booster pump': 'بوسْتَر پَمْپ', 'water tank': 'ووتَر تانْك', 'riser': 'رايْزَر', 'drainage': 'دْرِيْنِدج',
  'soil pipe': 'سويْل پايْپ', 'waste pipe': 'وِيْسْت پايْپ', 'vent pipe': 'ڤِنْت پايْپ', 'floor drain': 'فْلور دْرِيْن', 'P-trap': 'پي تْراپ',
  'cleanout': 'كْلينْ آوْت', 'manhole': 'مانْهول', 'gradient / slope': 'چْرِيْدْيِنْت / سْلوپ', 'gate valve': 'چِيْت ڤالْڤ', 'check valve': 'تشِك ڤالْڤ',
  'pressure reducing valve (PRV)': 'پْرِشَر رِدْيوسِنْچ ڤالْڤ (پي آر ڤي)', 'water heater': 'ووتَر هيتَر', 'leak': 'ليك', 'PPR pipe': 'پي پي آر پايْپ',
  'uPVC pipe': 'يو پي ڤي سي پايْپ', 'lifting station': 'لِفْتِنْچ سْتِيْشِن', 'grease trap': 'چْريس تْراپ', 'fixture unit': 'فِكْسْتْشَر يونِت',
  'flushing': 'فْلَشِنْچ', 'disinfection': 'دِسِنْفِكْشِن',
  /* Electrical */
  'main distribution board (MDB)': 'مِيْن دِسْتْرِبْيوشِن بورْد (إم دي بي)', 'sub-main distribution board (SMDB)': 'سَب مِيْن دِسْتْرِبْيوشِن بورْد (إس إم دي بي)',
  'circuit breaker': 'سِرْكِت بْرِيْكَر', 'cable tray': 'كِيْبِل تْرِيْه', 'conduit': 'كانْدْوِت', 'earthing / grounding': 'إرْثِنْچ / چْراوْنْدِنْچ',
  'lighting fixture': 'لايْتِنْچ فِكْسْتْشَر', 'transformer': 'تْرانْسْفورْمَر', 'generator': 'جِنِرِيْتَر', 'ATS (automatic transfer switch)': 'إيه تي إس (أوتَماتِك تْرانْسْفَر سْوِتْش)',
  'load schedule': 'لود سْكِجول', 'megger test': 'مِچَر تِسْت', 'short circuit': 'شورْت سِرْكِت', 'voltage drop': 'ڤولْتِدج دْراپ',
  'emergency lighting': 'إمِرْجِنْسي لايْتِنْچ', 'socket outlet': 'ساكِت آوْتْلِت', 'busbar / busway': 'بَسْبار / بَسْوِيْه', 'UPS': 'يو پي إس',
  'lightning protection': 'لايْتْنِنْچ پْرَتِكْشِن', 'single line diagram (SLD)': 'سِنْچِل لايْن دايَچْرام (إس إل دي)',
  /* Construction */
  'shop drawing': 'شاپ دْرويِنْچ', 'as-built drawing': 'آز بِلْت دْرويِنْچ', 'material submittal': 'مَتيريَل سَبْمِتَل', 'method statement': 'مِثَد سْتِيْتْمِنْت',
  'specifications': 'سْپِسِفِكِيْشِنْز', 'clash': 'كْلاش', 'coordination drawing': 'كو-أورْدِنِيْشِن دْرويِنْچ', 'false ceiling': 'فولْس سيلِنْچ',
  'shaft': 'شافْت', 'slab': 'سْلاب', 'sleeve': 'سْليڤ', 'scaffolding': 'سْكافَلْدِنْچ', 'subcontractor': 'سَبْكانْتْراكْتَر', 'main contractor': 'مِيْن كانْتْراكْتَر',
  'consultant': 'كَنْسَلْتِنْت', 'punch list': 'پَنْتْش لِسْت', 'mock-up': 'ماك أَپ', 'retention': 'رِتِنْشِن', 'defects liability period': 'ديفِكْتْس لايَبِلِتي پيريَد', 'fit-out': 'فِت آوْت',
  /* Project management */
  'BOQ (Bill of Quantities)': 'بي أو كيو (بِل أوڤ كْوانْتِتيز)', 'RFI (Request for Information)': 'آر إف آي (رِكْوِسْت فور إنْفَرْمِيْشِن)',
  'MIR (Material Inspection Request)': 'إم آي آر (مَتيريَل إنْسْپِكْشِن رِكْوِسْت)', 'IR (Inspection Request)': 'آي آر (إنْسْپِكْشِن رِكْوِسْت)',
  'WIR (Work Inspection Request)': 'دَبْليو آي آر (وِرْك إنْسْپِكْشِن رِكْوِسْت)', 'NCR (Non-Conformance Report)': 'إن سي آر (نان كَنْفورْمِنْس رِپورْت)',
  'site observation': 'سايْت أَبْزِرْڤِيْشِن', 'MOM (Minutes of Meeting)': 'إم أو إم (مِنِتْس أوڤ ميتِنْچ)', 'progress report': 'پْراچْرِس رِپورْت',
  'variation order (VO)': 'ڤيريِيْشِن أورْدَر (ڤي أو)', 'claim': 'كْلِيْم', 'project schedule': 'پْراجِكْت سْكِجول', 'critical path': 'كْرِتِكَل پاث',
  'delay analysis': 'دِلِيه أَنالَسِس', 'testing and commissioning (T&C)': 'تِسْتِنْچ آنْد كَمِشَنِنْچ (تي آنْد سي)', 'extension of time (EOT)': 'إكْسْتِنْشِن أوڤ تايْم (إي أو تي)',
  'baseline': 'بِيْسْلايْن', 'float': 'فْلوت', 'milestone': 'مايْلْسْتون', 'scope of work': 'سْكوپ أوڤ وِرْك', 'procurement': 'پْرَكْيورْمِنْت',
  'long-lead item': 'لونْچ ليد آيْتِم', 'handover documents': 'هانْدوڤَر داكْيومِنْتْس', 'O&M manual': 'أو آنْد إم مانْيوَل',
  'interim payment certificate (IPC)': 'إنْتِرِم پِيْمِنْت سِرْتِفِكِت (آي پي سي)', 'back charge': 'باك تشارْج', 'liquidated damages (LDs)': 'لِكْوِدِيْتِد دامِدجِز (إل ديز)',
  'lookahead schedule': 'لوك أَهِد سْكِجول', 'transmittal': 'تْرانْزْمِتَل', 'substantial completion': 'سَبْسْتانْشَل كَمْپْليشِن',
  /* Advanced */
  'expedite': 'إكْسْپِدايْت', 'discrepancy': 'دِسْكْرِپَنْسي', 'mitigate': 'مِتِچِيْت', 'entitlement': 'إنْتايْتِلْمِنْت', 'notwithstanding': 'ناتْوِثْسْتانْدِنْچ',
  'compliance': 'كَمْپْلايَنْس', 'feasible': 'فيزِبِل', 'comprehensive': 'كامْپْرِهِنْسِڤ', 'allocate': 'آلَكِيْت', 'concise': 'كَنْسايْس',
  'stakeholder': 'سْتِيْكْهولْدَر', 'leverage': 'لِڤَرِدج', 'contingency': 'كَنْتِنْجِنْسي', 'commence': 'كَمِنْس', 'adhere to': 'أَدْهير تو',
  'rectify': 'رِكْتِفاي', 'substantiate': 'سَبْسْتانْشِيِيْت', 'without prejudice': 'وِذاوْت پْرِجَدِس', 'pursuant to': 'پَرْسْيوَنْت تو', 'bottleneck': 'باتِلْنِك',
  /* Minimal pairs */
  'pump': 'پَمْپ', 'bump': 'بَمْپ', 'pipe': 'پايْپ', 'bribe': 'بْرايْب', 'pen': 'پِن', 'Ben': 'بِن', 'pole': 'پول', 'bowl': 'بول', 'pack': 'پاك', 'back': 'باك',
  'plan': 'پْلان', 'bland': 'بْلانْد', 'valve': 'ڤالْڤ', 'fault': 'فولْت', 'vent': 'ڤِنْت', 'fent': 'فِنْت', 'view': 'ڤْيو', 'few': 'فْيو', 'very': 'ڤِري', 'ferry': 'فِري',
  'van': 'ڤان', 'fan': 'فان', 'vast': 'ڤاسْت', 'fast': 'فاسْت', 'think': 'ثِنْك', 'sink': 'سِنْك', 'three': 'ثْري', 'tree': 'تْري', 'thick': 'ثِك', 'tick': 'تِك',
  'thermal': 'ثِرْمَل', 'sermon': 'سِرْمَن', 'path': 'پاث', 'pass': 'پاس', 'thank': 'ثانْك', 'tank': 'تانْك', 'fill': 'فِل (قصيرة)', 'feel': 'فيييل (طويلة)',
  'ship': 'شِپ (قصيرة)', 'sheep': 'شييپ (طويلة)', 'live': 'لِڤ (قصيرة)', 'leave': 'لييڤ (طويلة)', 'fit': 'فِت (قصيرة)', 'feet': 'فييت (طويلة)',
  'bit': 'بِت (قصيرة)', 'beat': 'بييت (طويلة)', 'still': 'سْتِل (قصيرة)', 'steel': 'سْتييل (طويلة)', 'pin': 'پِن (ɪ: قصيرة ومرتخية)',
  'test': 'تِسْت', 'twist': 'تْوِسْت', 'set': 'سِت (e: افتح فمك أكثر)', 'sit': 'سِت (ɪ: قصيرة ومرتخية)', 'bed': 'بِد (e: افتح فمك أكثر)', 'bid': 'بِد (ɪ: قصيرة ومرتخية)', 'check': 'تشِك (e: افتح فمك أكثر)', 'chick': 'تشِك (ɪ: قصيرة ومرتخية)',
  'left': 'لِفْت (e: افتح فمك أكثر)', 'lift': 'لِفْت (ɪ: قصيرة ومرتخية)', 'street': 'سْتْريت', 'structure': 'سْتْرَكْتْشَر', 'strength': 'سْتْرِنْچْث', 'split': 'سْپْلِت', 'spray': 'سْپْرِيْه',
  'screen': 'سْكْرين', 'scrap': 'سْكْراپ', 'tested': 'تِسْتِد', 'texts': 'تِكْسْتْس', 'months': 'مَنْثْس', 'sixths': 'سِكْسْثْس'
};

/* Word-stress drill: the stressed syllable is in [brackets] */
window.PRON_AR_STRESS = {
  'comMISsioning': 'كَ-[مِ]-شَنِنْچ', 'MAINtenance': '[مِيْن]-تِنَنْس', 'ventiLAtion': 'ڤِنْتِ-[لِيْ]-شِن', 'distriBUtion': 'دِسْتْرِ-[بْيو]-شِن',
  'engiNEER': 'إنْجِ-[نير]', 'deVElopment': 'دِ-[ڤِ]-لَپْمِنْت', 'specifiCAtion': 'سْپِسِفِ-[كِيْ]-شِن', 'insuLAtion': 'إنْسْيو-[لِيْ]-شِن',
  'calcuLAtion': 'كالْكْيو-[لِيْ]-شِن', 'coordiNAtion': 'كو-أورْدِ-[نِيْ]-شِن', 'PHOtograph': '[فو]-تَچْراف', 'phoTOgraphy': 'فَ-[تا]-چْرَفي'
};

window.PRON_AR_LEGEND = [['پ', 'P'], ['ڤ', 'V'], ['چ', 'G (جيم مصرية)'], ['ج', 'J (جيم معطّشة)'], ['ث', 'th (think)'], ['ذ', 'th (this)'], ['تش', 'ch'], ['[ ]', 'المقطع المشدّد']];
