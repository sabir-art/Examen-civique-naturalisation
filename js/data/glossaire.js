/**
 * Glossaire des mots difficiles du récit.
 *
 * Beaucoup de mots de l'examen civique n'existent pas dans la conversation
 * courante : « laïcité », « suffrage », « promulguer », « juridiction ». Les
 * rencontrer au milieu d'une phrase sans en connaître le sens fait perdre le
 * fil du texte entier.
 *
 * Chaque entrée donne donc :
 *   - `def` : une définition en français SIMPLE, sans autre mot difficile ;
 *   - `ar`  : le mot en arabe, puis la même définition en arabe ;
 *   - `voir`: les formes sous lesquelles le mot apparaît dans le texte
 *             (pluriel, féminin, forme élidée). C'est ce qui permet de le
 *             repérer automatiquement dans les chapitres.
 *
 * L'ordre n'a pas d'importance : les termes sont triés à l'affichage, et le
 * repérage dans le texte se fait du plus long au plus court pour que
 * « suffrage universel » l'emporte sur « suffrage ».
 */

export const GLOSSAIRE = [
  /* ------------------------------------------------ la République et l'État */
  {
    terme: 'République',
    def: "Régime où le pouvoir n'appartient à personne en propre : il est confié pour un temps à des représentants élus. Vient du latin res publica, « la chose publique », ce qui appartient à tous.",
    ar: 'الجمهورية — نظام حكم لا يملك فيه أحد السلطة ملكية خاصة، بل تُسند لفترة محدودة إلى ممثّلين منتخبين. الكلمة من اللاتينية res publica أي «الشأن العام»، ما يخصّ الجميع.',
    voir: ['République', 'république', 'républicain', 'républicaine', 'républicains'],
  },
  {
    terme: 'Constitution',
    def: "Le texte le plus important du pays. Il dit comment le pouvoir est organisé et quels droits sont garantis. Aucune loi ne peut lui être contraire.",
    ar: 'الدستور — أهمّ نصّ في البلاد. يحدّد كيفية تنظيم السلطة والحقوق المضمونة. ولا يجوز لأيّ قانون أن يخالفه.',
    voir: ['Constitution', 'constitution', 'constitutionnel', 'constitutionnelle'],
  },
  {
    terme: 'État',
    def: "L'ensemble des institutions qui gouvernent un pays : gouvernement, administrations, écoles publiques, police, justice.",
    ar: 'الدولة — مجموع المؤسسات التي تحكم البلد: الحكومة والإدارات والمدارس العمومية والشرطة والقضاء.',
    voir: ["l'État", 'État'],
  },
  {
    terme: 'Nation',
    def: "L'ensemble des citoyens d'un pays, considérés comme formant une communauté qui décide de son avenir ensemble.",
    ar: 'الأمّة — مجموع مواطني بلد ما، باعتبارهم جماعة واحدة تقرّر مستقبلها معًا.',
    voir: ['Nation', 'nation', 'nationale', 'national'],
  },
  {
    terme: 'monarchie absolue',
    def: "Régime où le roi décide seul de tout : il fait les lois, les applique et juge. Personne ne peut lui dire non.",
    ar: 'الملكية المطلقة — نظام يقرّر فيه الملك كلّ شيء وحده: يضع القوانين وينفّذها ويقضي بها، ولا يستطيع أحد أن يعترض عليه.',
    voir: ['monarchie absolue', 'monarchie', 'monarque'],
  },
  {
    terme: 'souveraineté',
    def: "Le fait de détenir le pouvoir suprême. En France, elle appartient au peuple : c'est lui la source de toute autorité.",
    ar: 'السيادة — امتلاك السلطة العليا. في فرنسا تعود السيادة إلى الشعب، فهو مصدر كلّ سلطة.',
    voir: ['souveraineté', 'souverain', 'souveraine'],
  },
  {
    terme: 'indivisible',
    def: "Qui ne peut pas être coupé en morceaux. La République est la même partout sur le territoire : mêmes lois, mêmes droits.",
    ar: 'لا تتجزّأ — لا يمكن تقسيمها. الجمهورية واحدة في كامل التراب: القوانين نفسها والحقوق نفسها.',
    voir: ['indivisible'],
  },

  /* ---------------------------------------------------------- la laïcité */
  {
    terme: 'laïcité',
    def: "Règle qui sépare les religions et l'État. L'État ne favorise ni ne combat aucune religion ; chacun croit ou ne croit pas librement, et les services publics restent neutres.",
    ar: 'العَلمانية — قاعدة تفصل بين الأديان والدولة. لا تفضّل الدولة دينًا ولا تحارب دينًا؛ ولكلّ إنسان أن يؤمن أو لا يؤمن بحرّية، وتبقى المرافق العمومية على الحياد.',
    voir: ['laïcité', 'laïque', 'laïques', 'Laïque'],
  },
  {
    terme: 'neutralité',
    def: "Le fait de ne prendre parti pour personne. Un agent public en service ne montre ni sa religion ni ses opinions politiques.",
    ar: 'الحياد — عدم الانحياز إلى أيّ طرف. فالموظّف العمومي أثناء عمله لا يُظهر دينه ولا آراءه السياسية.',
    voir: ['neutralité', 'neutre', 'neutres'],
  },
  {
    terme: 'culte',
    def: "La pratique d'une religion : prier, se réunir, célébrer. « Le libre exercice des cultes » veut dire que chacun peut pratiquer sa religion.",
    ar: 'العبادة / ممارسة الشعائر — أداء الطقوس الدينية من صلاة واجتماع واحتفال. و«حرّية ممارسة الشعائر» تعني أنّ لكلّ إنسان أن يمارس دينه.',
    voir: ['des cultes', 'culte', 'cultes'],
  },
  {
    terme: 'ostensible',
    def: "Que l'on voit tout de suite et que l'on ne peut pas manquer. Un signe religieux ostensible est un signe visible de loin, immédiatement identifiable.",
    ar: 'ظاهر بشكل لافت — ما يُرى فورًا ولا يمكن إغفاله. والرمز الديني «الظاهر» هو ما يُرى من بعيد ويُعرف من فوره.',
    voir: ['ostensibles', 'ostensible'],
  },
  {
    terme: 'liberté de conscience',
    def: "Le droit de croire, de ne pas croire, ou de changer de religion, sans avoir à s'en expliquer ni à en subir les conséquences.",
    ar: 'حرّية المعتقد — الحقّ في الإيمان أو عدم الإيمان أو تغيير الدين، دون تبرير ودون أن يترتّب على ذلك ضرر.',
    voir: ['liberté de conscience'],
  },

  /* ------------------------------------------------------- voter, élire */
  {
    terme: 'suffrage universel',
    def: "Le vote ouvert à tous les citoyens majeurs, sans condition de fortune, d'instruction ni de sexe.",
    ar: 'الاقتراع العامّ — التصويت المفتوح لكلّ المواطنين البالغين، دون شرط الثروة أو التعليم أو الجنس.',
    voir: ['suffrage universel masculin', 'suffrage universel direct', 'suffrage universel', 'suffrage'],
  },
  {
    terme: 'scrutin',
    def: "L'opération du vote elle-même : le jour, le lieu et la façon dont on compte les voix.",
    ar: 'الاقتراع — عملية التصويت نفسها: يومها ومكانها وطريقة فرز الأصوات.',
    voir: ['scrutin'],
  },
  {
    terme: 'éligibilité',
    def: "Le droit de se présenter à une élection, c'est-à-dire d'être candidat et non seulement électeur.",
    ar: 'الأهلية للترشّح — الحقّ في الترشّح للانتخابات، أي أن يكون المرء مرشّحًا لا ناخبًا فحسب.',
    voir: ["d'éligibilité", 'éligibilité', 'éligible'],
  },
  {
    terme: 'référendum',
    def: "Vote où l'on répond directement par oui ou par non à une question posée à tout le pays, sans passer par les élus.",
    ar: 'الاستفتاء — تصويت يُجيب فيه الناس مباشرة بنعم أو لا عن سؤال يُطرح على البلاد كلّها، دون وساطة المنتخَبين.',
    voir: ['référendum'],
  },
  {
    terme: 'mandat',
    def: "La durée pendant laquelle un élu exerce sa fonction. Le mandat du Président est de cinq ans.",
    ar: 'العُهدة (الولاية) — المدّة التي يمارس فيها المنتخَب مهامّه. وعهدة رئيس الجمهورية خمس سنوات.',
    voir: ['mandat', 'mandats'],
  },
  {
    terme: 'liste électorale',
    def: "Le registre de la mairie où l'on doit être inscrit pour pouvoir voter. Sans inscription, pas de bulletin.",
    ar: 'القائمة الانتخابية — سجلّ في البلدية يجب التسجيل فيه للتمكّن من التصويت؛ فبدون تسجيل لا ورقة اقتراع.',
    voir: ['listes électorales', 'liste électorale'],
  },
  {
    terme: 'isoloir',
    def: "La petite cabine fermée par un rideau où l'on prépare son bulletin seul. Elle rend le vote secret.",
    ar: 'المعزل (كابينة التصويت) — حجيرة صغيرة مغلقة بستارة يُهيّئ فيها الناخب ورقته وحده، وهي التي تجعل التصويت سرّيًّا.',
    voir: ['isoloir'],
  },

  /* --------------------------------------------------- les trois pouvoirs */
  {
    terme: 'séparation des pouvoirs',
    def: "Le principe qui confie à trois autorités différentes le fait de faire la loi, de l'appliquer et de juger — pour qu'aucune ne devienne trop forte.",
    ar: 'الفصل بين السلطات — مبدأ يُسند سنّ القانون وتنفيذه والقضاء به إلى ثلاث سلطات مختلفة، حتى لا تستقوي واحدة على الأخرى.',
    voir: ['séparation des pouvoirs'],
  },
  {
    terme: 'pouvoir exécutif',
    def: "Celui qui applique les lois et dirige le pays au jour le jour : le Président de la République et le Gouvernement.",
    ar: 'السلطة التنفيذية — الجهة التي تطبّق القوانين وتدير شؤون البلاد يوميًّا: رئيس الجمهورية والحكومة.',
    voir: ['pouvoir exécutif', 'exécutif'],
  },
  {
    terme: 'pouvoir législatif',
    def: "Celui qui écrit et vote les lois : le Parlement, formé de l'Assemblée nationale et du Sénat.",
    ar: 'السلطة التشريعية — الجهة التي تكتب القوانين وتصوّت عليها: البرلمان المكوَّن من الجمعية الوطنية ومجلس الشيوخ.',
    voir: ['pouvoir législatif', 'législatif'],
  },
  {
    terme: 'pouvoir judiciaire',
    def: "Celui qui juge : les tribunaux et les cours. Il est indépendant des deux autres pouvoirs.",
    ar: 'السلطة القضائية — الجهة التي تحكم بين الناس: المحاكم بأنواعها، وهي مستقلّة عن السلطتين الأخريين.',
    voir: ['pouvoir judiciaire', 'judiciaire'],
  },
  {
    terme: 'Parlement',
    def: "Les deux assemblées qui votent la loi : l'Assemblée nationale (élue directement) et le Sénat (élu indirectement).",
    ar: 'البرلمان — المجلسان اللذان يصوّتان على القانون: الجمعية الوطنية (تُنتخب مباشرة) ومجلس الشيوخ (يُنتخب بشكل غير مباشر).',
    voir: ['Parlement européen', 'Parlement'],
  },
  {
    terme: 'Assemblée nationale',
    def: "La chambre des députés, élus directement par les citoyens pour cinq ans. Elle vote la loi et peut renverser le Gouvernement.",
    ar: 'الجمعية الوطنية — مجلس النوّاب، يُنتخبون مباشرة من المواطنين لخمس سنوات، يصوّتون على القانون ويمكنهم إسقاط الحكومة.',
    voir: ['Assemblée nationale', 'Assemblée'],
  },
  {
    terme: 'Sénat',
    def: "La seconde chambre du Parlement. Ses membres sont élus pour six ans par les élus locaux, non par les citoyens directement.",
    ar: 'مجلس الشيوخ — الغرفة الثانية في البرلمان، ينتخب أعضاءه لستّ سنوات المنتخَبون المحلّيون، لا المواطنون مباشرة.',
    voir: ['Sénat', 'sénateur', 'sénateurs'],
  },
  {
    terme: 'Conseil constitutionnel',
    def: "L'institution qui vérifie qu'une loi respecte la Constitution. Si ce n'est pas le cas, la loi ne peut pas s'appliquer.",
    ar: 'المجلس الدستوري — المؤسسة التي تتحقّق من مطابقة القانون للدستور؛ فإن خالفه لم يجز تطبيقه.',
    voir: ['Conseil constitutionnel'],
  },
  {
    terme: 'Conseil d’État',
    def: "La plus haute juridiction pour les litiges entre les citoyens et l'administration. Il conseille aussi le Gouvernement.",
    ar: 'مجلس الدولة — أعلى جهة قضائية في النزاعات بين المواطنين والإدارة، وهو أيضًا هيئة استشارية للحكومة.',
    voir: ["Conseil d'État", 'Conseil d’État'],
  },
  {
    terme: 'Cour de cassation',
    def: "La plus haute juridiction judiciaire. Elle ne rejuge pas les faits : elle vérifie que la loi a été correctement appliquée.",
    ar: 'محكمة النقض — أعلى جهة في القضاء العدلي. لا تعيد النظر في الوقائع، بل تتحقّق من حسن تطبيق القانون.',
    voir: ['Cour de cassation'],
  },
  {
    terme: 'décret',
    def: "Une décision écrite du Président ou du Premier ministre, qui précise comment appliquer une loi.",
    ar: 'مرسوم — قرار مكتوب يصدر عن رئيس الجمهورية أو الوزير الأوّل، يوضّح كيفية تطبيق القانون.',
    voir: ['décret', 'décrets'],
  },
  {
    terme: 'promulguer',
    def: "Signer officiellement une loi votée par le Parlement pour la rendre applicable. C'est le Président qui promulgue.",
    ar: 'الإصدار (ختم القانون) — التوقيع الرسمي على قانون صوّت عليه البرلمان ليصبح نافذًا، ويقوم به رئيس الجمهورية.',
    voir: ['promulgue', 'promulguer', 'promulguée'],
  },

  /* ------------------------------------------------- justice et infractions */
  {
    terme: 'juridiction',
    def: "Un tribunal ou une cour : le lieu et l'autorité qui jugent. « Justice judiciaire » et « justice administrative » sont deux familles de juridictions.",
    ar: 'جهة قضائية — محكمة أو مجلس قضائي: المكان والسلطة اللذان يحكمان. و«القضاء العدلي» و«القضاء الإداري» عائلتان من الجهات القضائية.',
    voir: ['juridiction', 'juridictions'],
  },
  {
    terme: 'contravention',
    def: "L'infraction la moins grave : stationnement interdit, petit excès de vitesse. Punie d'une amende, jamais de prison.",
    ar: 'مخالفة — أخفّ درجات الجرم: كالوقوف الممنوع أو تجاوز طفيف للسرعة، عقوبتها غرامة مالية لا سجن.',
    voir: ['contraventions', 'contravention'],
  },
  {
    terme: 'délit',
    def: "Une infraction moyennement grave : vol, violences, conduite en état d'ivresse. Jugée par le tribunal correctionnel.",
    ar: 'جُنحة — جرم متوسّط الخطورة: كالسرقة والعنف والقيادة في حالة سُكر، تنظر فيه محكمة الجنح.',
    voir: ['délits', 'délit'],
  },
  {
    terme: 'crime',
    def: "L'infraction la plus grave : meurtre, viol. Jugée par la cour d'assises ou la cour criminelle.",
    ar: 'جناية — أخطر أنواع الجرائم كالقتل والاغتصاب، تنظر فيها محكمة الجنايات.',
    voir: ['crimes', 'crime'],
  },
  {
    terme: 'présomption d’innocence',
    def: "La règle selon laquelle toute personne est considérée innocente tant qu'un tribunal ne l'a pas déclarée coupable. Ce n'est pas à elle de prouver son innocence.",
    ar: 'قرينة البراءة — قاعدة تعتبر كلّ شخص بريئًا حتى تُثبت المحكمة إدانته، وليس عليه هو أن يُثبت براءته.',
    voir: ["présomption d'innocence", 'présomption d’innocence', 'présumé innocent', 'présumée innocente'],
  },
  {
    terme: 'aide juridictionnelle',
    def: "L'aide de l'État qui paie tout ou partie de l'avocat quand on n'en a pas les moyens.",
    ar: 'المساعدة القضائية — مساعدة من الدولة تتكفّل بأتعاب المحامي كلّها أو بعضها لمن لا يقدر على دفعها.',
    voir: ['aide juridictionnelle'],
  },
  {
    terme: 'procès contradictoire',
    def: "Un procès où chaque partie peut connaître ce qu'on lui reproche et y répondre. Personne n'est jugé sans avoir pu se défendre.",
    ar: 'محاكمة حضورية (تواجهية) — محاكمة يعرف فيها كلّ طرف ما يُنسب إليه ويردّ عليه، فلا يُحاكم أحد دون أن يتمكّن من الدفاع عن نفسه.',
    voir: ['procès public et contradictoire', 'contradictoire'],
  },
  {
    terme: 'faire appel',
    def: "Demander qu'une affaire déjà jugée soit réexaminée par une juridiction supérieure.",
    ar: 'الاستئناف — طلب إعادة النظر في قضية سبق الحكم فيها أمام جهة قضائية أعلى.',
    voir: ["droit d'appel", 'faire appel'],
  },
  {
    terme: 'juré d’assises',
    def: "Un citoyen tiré au sort qui juge les crimes aux côtés de magistrats professionnels. C'est un devoir, pas un choix.",
    ar: 'محلّف في محكمة الجنايات — مواطن يُختار بالقرعة ليحكم في الجنايات إلى جانب قضاة محترفين، وهو واجب لا اختيار.',
    voir: ["juré d'assises", 'juré d’assises', 'juré'],
  },
  {
    terme: 'abolition',
    def: "La suppression définitive d'une chose par la loi : l'abolition de l'esclavage en 1848, celle de la peine de mort en 1981.",
    ar: 'الإلغاء — إبطال أمر ما نهائيًّا بموجب القانون: كإلغاء الرقّ سنة 1848 وإلغاء عقوبة الإعدام سنة 1981.',
    voir: ['abolition', 'abolie', 'aboli', 'abolit'],
  },
  {
    terme: 'peine de mort',
    def: "La condamnation à être exécuté. Abolie en France en 1981, et interdite par la Constitution depuis 2007.",
    ar: 'عقوبة الإعدام — الحكم بإزهاق روح المحكوم عليه. أُلغيت في فرنسا سنة 1981 وحُظرت دستوريًّا منذ 2007.',
    voir: ['peine de mort'],
  },

  /* --------------------------------------------- droits, devoirs, égalité */
  {
    terme: 'discrimination',
    def: "Traiter quelqu'un moins bien qu'un autre, dans une situation comparable, à cause de son origine, son sexe, sa religion, son âge ou son handicap. C'est puni par la loi.",
    ar: 'التمييز — معاملة شخص معاملة أسوأ من غيره في وضع مماثل بسبب أصله أو جنسه أو دينه أو سنّه أو إعاقته، وهو معاقَب عليه قانونًا.',
    voir: ['discrimination', 'discriminations', 'discriminatoire'],
  },
  {
    terme: 'antisémitisme',
    def: "La haine ou le rejet des personnes juives. C'est une forme particulière de racisme, punie par la loi.",
    ar: 'معاداة السامية — كراهية اليهود أو رفضهم، وهي شكل خاصّ من العنصرية يعاقب عليه القانون.',
    voir: ['antisémitisme', "l'antisémitisme"],
  },
  {
    terme: 'diffamation',
    def: "Accuser publiquement quelqu'un d'un fait précis qui porte atteinte à son honneur, sans pouvoir le prouver.",
    ar: 'القذف — اتّهام شخص علنًا بواقعة محدّدة تمسّ شرفه دون القدرة على إثباتها.',
    voir: ['diffamation', 'la diffamation'],
  },
  {
    terme: 'apologie du terrorisme',
    def: "Présenter publiquement un acte terroriste comme juste ou admirable. C'est un délit puni par la loi.",
    ar: 'تمجيد الإرهاب — تقديم عمل إرهابي علنًا على أنّه عمل عادل أو يستحقّ الإعجاب، وهو جُنحة يعاقب عليها القانون.',
    voir: ['apologie du terrorisme', 'apologie'],
  },
  {
    terme: 'polygamie',
    def: "Le fait d'être marié à plusieurs personnes en même temps. Interdit en France, quelle que soit la religion.",
    ar: 'تعدّد الزوجات — الارتباط بأكثر من زوج أو زوجة في الوقت نفسه، وهو ممنوع في فرنسا مهما كان الدين.',
    voir: ['polygamie'],
  },
  {
    terme: 'excision',
    def: "La mutilation des organes génitaux d'une fille. C'est un crime en France, même s'il est commis à l'étranger.",
    ar: 'الختان (تشويه الأعضاء التناسلية للإناث) — تشويه أعضاء الفتاة التناسلية، وهو جناية في فرنسا حتى وإن ارتُكب في الخارج.',
    voir: ['excision'],
  },
  {
    terme: 'mariage forcé',
    def: "Un mariage imposé à quelqu'un contre sa volonté. Il est interdit : le consentement libre des deux époux est obligatoire.",
    ar: 'الزواج القسري — زواج يُفرض على شخص رغمًا عنه، وهو ممنوع؛ إذ يُشترط الرضا الحرّ من الزوجين معًا.',
    voir: ['mariages forcés', 'mariage forcé'],
  },
  {
    terme: 'devoir civique',
    def: "Une obligation qui vient de la citoyenneté : respecter la loi, payer ses impôts, être juré, aider une personne en danger.",
    ar: 'الواجب المدني — التزام ينبع من المواطنة: احترام القانون، ودفع الضرائب، وأداء مهمّة المحلّف، وإغاثة الملهوف.',
    voir: ['devoir civique', 'devoirs civiques'],
  },
  {
    terme: 'volonté générale',
    def: "Ce que le peuple entier veut, exprimé par la loi. La loi n'est pas la volonté d'un chef, mais celle de tous.",
    ar: 'الإرادة العامّة — ما يريده الشعب كلّه معبَّرًا عنه بالقانون؛ فالقانون ليس إرادة حاكم بل إرادة الجميع.',
    voir: ['volonté générale'],
  },

  /* ------------------------------------------------ solidarité et travail */
  {
    terme: 'Sécurité sociale',
    def: "Le système qui rembourse les soins, verse les retraites et aide les familles. Financé par les cotisations prises sur les salaires.",
    ar: 'الضمان الاجتماعي — النظام الذي يعوّض نفقات العلاج ويصرف المعاشات ويساعد العائلات، ويُموَّل من الاشتراكات المقتطعة من الأجور.',
    voir: ['Sécurité sociale'],
  },
  {
    terme: 'cotisation',
    def: "La part prélevée sur un salaire pour financer la santé, le chômage et les retraites de tout le monde.",
    ar: 'الاشتراك — الحصّة المقتطعة من الأجر لتمويل الصحّة والبطالة والتقاعد للجميع.',
    voir: ['cotisations', 'cotisation', 'cotisant', 'cotise'],
  },
  {
    terme: 'impôt',
    def: "L'argent versé à l'État par chacun, selon ses moyens, pour payer les écoles, les routes, les hôpitaux et la justice.",
    ar: 'الضريبة — مال يدفعه كلّ فرد للدولة بحسب قدرته، لتمويل المدارس والطرقات والمستشفيات والقضاء.',
    voir: ['impôts', 'impôt'],
  },
  {
    terme: 'SMIC',
    def: "Le salaire minimum légal en France : aucun employeur n'a le droit de payer moins pour un temps plein.",
    ar: 'الأجر الأدنى المضمون (SMIC) — الحدّ الأدنى القانوني للأجر في فرنسا؛ لا يحقّ لأيّ ربّ عمل أن يدفع أقلّ منه مقابل عمل بدوام كامل.',
    voir: ['SMIC'],
  },
  {
    terme: 'syndicat',
    def: "Une organisation de salariés qui les représente et défend leurs droits face à l'employeur.",
    ar: 'النقابة — تنظيم للأُجراء يمثّلهم ويدافع عن حقوقهم أمام ربّ العمل.',
    voir: ['syndicat', 'syndicats', 'syndicale'],
  },
  {
    terme: 'droit de grève',
    def: "Le droit d'arrêter le travail collectivement pour obtenir quelque chose. Il est inscrit dans la Constitution.",
    ar: 'حقّ الإضراب — الحقّ في التوقّف الجماعي عن العمل للمطالبة بمطلب ما، وهو مكرَّس في الدستور.',
    voir: ['droit de grève', 'grève'],
  },
  {
    terme: 'Défenseur des droits',
    def: "Une autorité indépendante que l'on peut saisir gratuitement quand on estime avoir été victime d'une discrimination ou mal traité par un service public.",
    ar: 'المدافع عن الحقوق — هيئة مستقلّة يمكن اللجوء إليها مجّانًا عند التعرّض للتمييز أو لسوء معاملة من مرفق عمومي.',
    voir: ['Défenseur des droits'],
  },

  /* ------------------------------------------ territoire et administration */
  {
    terme: 'commune',
    def: "La plus petite collectivité de France : une ville ou un village, dirigé par un maire et un conseil municipal.",
    ar: 'البلدية — أصغر وحدة إدارية في فرنسا: مدينة أو قرية يديرها العمدة والمجلس البلدي.',
    voir: ['commune', 'communes', 'municipal', 'municipale'],
  },
  {
    terme: 'préfet',
    def: "Le représentant de l'État dans un département. Il n'est pas élu : il est nommé par le Président.",
    ar: 'المحافظ — ممثّل الدولة في المحافظة؛ ليس منتخَبًا بل يُعيَّن من رئيس الجمهورية.',
    voir: ['préfets', 'préfet', 'préfecture', 'préfectures'],
  },
  {
    terme: 'département',
    def: "Une division du territoire, entre la commune et la région. La France en compte 101, outre-mer compris.",
    ar: 'المحافظة (الدائرة) — تقسيم ترابي يقع بين البلدية والجهة. وفي فرنسا 101 محافظة بما فيها ما وراء البحار.',
    voir: ['département', 'départements', 'départementales'],
  },
  {
    terme: 'outre-mer',
    def: "Les territoires français situés hors d'Europe : Guadeloupe, Martinique, Guyane, La Réunion, Mayotte et d'autres.",
    ar: 'ما وراء البحار — الأقاليم الفرنسية الواقعة خارج أوروبا: غوادلوب والمارتينيك وغويانا ولا ريونيون ومايوت وغيرها.',
    voir: ['outre-mer'],
  },

  /* -------------------------------------------------------- Europe */
  {
    terme: 'Union européenne',
    def: "L'association de 27 pays européens qui décident ensemble de certaines règles communes et partagent un marché unique.",
    ar: 'الاتحاد الأوروبي — تجمّع من 27 دولة أوروبية تقرّر معًا قواعد مشتركة وتتقاسم سوقًا موحّدة.',
    voir: ['Union européenne', 'européenne', 'européennes', 'Européennes'],
  },
  {
    terme: 'traité',
    def: "Un accord signé entre plusieurs États, qui les engage juridiquement. Le traité de Rome (1957) et celui de Maastricht (1992) ont bâti l'Europe.",
    ar: 'معاهدة — اتّفاق يُبرم بين دول ويلزمها قانونًا. وقد بُني الاتحاد الأوروبي على معاهدة روما (1957) ومعاهدة ماستريخت (1992).',
    voir: ['traité de Maastricht', 'traité de Rome', 'traité', 'traités'],
  },
  {
    terme: 'citoyenneté européenne',
    def: "Un statut qui s'ajoute à la nationalité française : il donne le droit de circuler, de s'installer et de voter aux élections municipales et européennes dans un autre pays de l'Union.",
    ar: 'المواطَنة الأوروبية — صفة تُضاف إلى الجنسية الفرنسية، تخوّل التنقّل والإقامة والتصويت في الانتخابات البلدية والأوروبية داخل دولة أخرى من الاتحاد.',
    voir: ['citoyenneté européenne', 'citoyen de l’Union européenne', "citoyen de l'Union européenne"],
  },

  /* ---------------------------------------------------- mots d'histoire */
  {
    terme: 'édit',
    def: "Une décision écrite du roi, qui avait force de loi. L'édit de Nantes (1598) autorisait les protestants à pratiquer leur culte.",
    ar: 'مرسوم ملكي — قرار مكتوب يصدر عن الملك وله قوّة القانون. وقد سمح «مرسوم نانت» (1598) للبروتستانت بممارسة شعائرهم.',
    voir: ['édit de Nantes', 'édit'],
  },
  {
    terme: 'États généraux',
    def: "Une assemblée exceptionnelle réunissant les représentants des trois ordres du royaume. Celle de 1789 a déclenché la Révolution.",
    ar: 'مجلس طبقات الأمّة — جمعية استثنائية تضمّ ممثّلي طبقات المملكة الثلاث، وقد فجّر اجتماعها سنة 1789 الثورة الفرنسية.',
    voir: ['États généraux'],
  },
  {
    terme: 'ordre',
    def: "Sous l'Ancien Régime, l'un des trois groupes de la société : le clergé, la noblesse et le tiers état.",
    ar: 'الطبقة — في النظام القديم، إحدى فئات المجتمع الثلاث: رجال الدين والنبلاء والطبقة الثالثة.',
    voir: ['ordres'],
  },
  {
    terme: 'armistice',
    def: "L'accord qui arrête les combats entre deux armées. Celui du 11 novembre 1918 a mis fin aux combats de la Première Guerre mondiale.",
    ar: 'الهدنة — اتّفاق يوقف القتال بين جيشين. وقد أنهت هدنة 11 نوفمبر 1918 معارك الحرب العالمية الأولى.',
    voir: ['armistice'],
  },
  {
    terme: 'Résistance',
    def: "Les Français qui, entre 1940 et 1944, ont combattu clandestinement l'occupation allemande et le régime de Vichy.",
    ar: 'المقاومة — الفرنسيون الذين قاوموا سرًّا بين 1940 و1944 الاحتلالَ الألماني ونظامَ فيشي.',
    voir: ['Résistance', 'résistants', 'résistant'],
  },
  {
    terme: 'Poilus',
    def: "Le surnom donné aux soldats français de la Première Guerre mondiale, qui vivaient des mois dans la boue des tranchées.",
    ar: 'البواليس — لقب الجنود الفرنسيين في الحرب العالمية الأولى، الذين عاشوا شهورًا في وحل الخنادق.',
    voir: ['Poilus', 'Poilu'],
  },
  {
    terme: 'esclavage',
    def: "Le fait de posséder des êtres humains comme une propriété. Aboli définitivement en France en 1848.",
    ar: 'الرقّ (العبودية) — امتلاك بشر كما تُملك الأشياء، وقد أُلغي نهائيًّا في فرنسا سنة 1848.',
    voir: ["l'esclavage", 'esclavage', 'esclaves'],
  },
  {
    terme: 'Lumières',
    def: "Le courant de pensée du XVIIIᵉ siècle qui plaçait la raison, la liberté et la tolérance au-dessus de la tradition et de l'autorité.",
    ar: 'عصر الأنوار — تيّار فكري في القرن الثامن عشر قدّم العقل والحرّية والتسامح على التقليد والسلطة.',
    voir: ['philosophes des Lumières', 'Lumières'],
  },
  {
    terme: 'Marianne',
    def: "La figure de femme qui représente la République française. Elle porte le bonnet phrygien, symbole de liberté, et son buste est dans les mairies.",
    ar: 'ماريان — تمثال امرأة يرمز إلى الجمهورية الفرنسية، تعتمر القبّعة الفريجية رمزَ الحرّية، ويوضع تمثالها النصفي في البلديات.',
    voir: ['Marianne'],
  },
  {
    terme: 'bonnet phrygien',
    def: "Le bonnet souple à pointe rabattue que porte Marianne. Dans l'Antiquité, il était donné aux esclaves affranchis : c'est le symbole de la liberté retrouvée.",
    ar: 'القبّعة الفريجية — قلنسوة ليّنة مطوية الرأس تعتمرها ماريان. كانت في العصور القديمة تُمنح للعبيد المحرَّرين، فصارت رمزًا للحرّية المستردّة.',
    voir: ['bonnet phrygien'],
  },

  /* ================================================================== *
   * Les mots qui bloquent la LECTURE.                                  *
   *                                                                    *
   * Ceux-ci ne tombent pas à l'examen. Ils sont là parce qu'un mot     *
   * inconnu au milieu d'une phrase fait perdre le fil du paragraphe    *
   * entier — et que les premiers chapitres, très narratifs, en sont    *
   * pleins sans contenir beaucoup de vocabulaire civique.              *
   * ================================================================== */

  {
    terme: 'Gaule',
    def: "Le nom que les Romains donnaient au territoire correspondant à peu près à la France actuelle, avant la conquête.",
    ar: 'بلاد الغال — الاسم الذي أطلقه الرومان على الأرض التي تقابل تقريبًا فرنسا اليوم، قبل الفتح.',
    voir: ['Gaule', 'gauloise', 'gaulois'],
  },
  {
    terme: 'légion',
    def: "L'unité de base de l'armée romaine, environ cinq mille hommes très entraînés.",
    ar: 'الفيلق — الوحدة الأساسية في الجيش الروماني، نحو خمسة آلاف رجل مدرَّبين تدريبًا عاليًا.',
    voir: ['légions', 'légion'],
  },
  {
    terme: 'aqueduc',
    def: "Un canal, souvent porté par des arches de pierre, qui amenait l'eau jusqu'aux villes romaines. Le pont du Gard en est un.",
    ar: 'قناة الماء — مجرى محمول غالبًا على أقواس حجرية كان يجلب الماء إلى المدن الرومانية، ومنها جسر الغار.',
    voir: ['aqueducs', 'aqueduc'],
  },
  {
    terme: 'siège',
    def: "Encercler une ville pour la couper de tout ravitaillement jusqu'à ce qu'elle se rende. « Lever le siège », c'est le faire cesser.",
    ar: 'الحصار — تطويق مدينة لقطع الإمداد عنها حتى تستسلم. و«فكّ الحصار» هو إنهاؤه.',
    voir: ['le siège', 'assiégée', 'assiégé'],
  },
  {
    terme: 'baptême',
    def: "La cérémonie par laquelle on entre dans la religion chrétienne. Un prêtre verse de l'eau sur la tête de la personne.",
    ar: 'المعمودية — طقس الدخول في الديانة المسيحية، يسكب فيه الكاهن الماء على رأس الشخص.',
    voir: ['baptême', 'baptise', 'baptisé'],
  },
  {
    terme: 'évêque',
    def: "Un responsable religieux chrétien qui dirige les prêtres d'une région. Au Moyen Âge, souvent l'un des rares à savoir lire et écrire.",
    ar: 'الأسقف — مسؤول ديني مسيحي يشرف على كهنة منطقة ما. وكان في العصور الوسطى من القلائل الذين يعرفون القراءة والكتابة.',
    voir: ['évêques', 'évêque'],
  },
  {
    terme: 'sacre',
    def: "La cérémonie religieuse qui faisait d'un homme un roi. Elle avait lieu à Reims et signifiait que son pouvoir venait de Dieu.",
    ar: 'التتويج المقدَّس — المراسم الدينية التي كانت تجعل من الرجل ملكًا، وتُقام في ريمس، وتعني أنّ سلطته آتية من الله.',
    voir: ['sacrés à Reims', 'du sacre', 'sacre', 'sacré'],
  },
  {
    terme: 'se convertir',
    def: "Changer de religion, adopter une autre foi que celle dans laquelle on vivait.",
    ar: 'اعتناق دين آخر — تغيير الدين والانتقال إلى عقيدة غير التي كان عليها المرء.',
    voir: ['se convertir', 'se convertit', 'convertit', 'conversion'],
  },
  {
    terme: 'hérésie',
    def: "Une croyance jugée contraire à la doctrine officielle de l'Église. On pouvait être condamné à mort pour cela.",
    ar: 'الهرطقة — معتقد يُعدّ مخالفًا للعقيدة الرسمية للكنيسة، وكان يُعاقَب عليه بالإعدام.',
    voir: ['hérésie'],
  },
  {
    terme: 'protestant',
    def: "Un chrétien qui suit la Réforme du XVIᵉ siècle et n'obéit pas au pape. En France, on les appelait aussi huguenots.",
    ar: 'بروتستانتي — مسيحي يتّبع الإصلاح الديني في القرن السادس عشر ولا يخضع للبابا، وكان يُطلق عليهم في فرنسا أيضًا اسم الهوغونوت.',
    voir: ['protestants', 'protestant', 'protestante'],
  },
  {
    terme: 'catholique',
    def: "Un chrétien qui reconnaît l'autorité du pape. C'était la religion officielle du royaume de France.",
    ar: 'كاثوليكي — مسيحي يعترف بسلطة البابا، وكانت الكاثوليكية الدين الرسمي لمملكة فرنسا.',
    voir: ['catholiques', 'catholique'],
  },
  {
    terme: 'révoquer',
    def: "Annuler une décision qu'on avait prise. Louis XIV a révoqué l'édit de Nantes : il l'a supprimé.",
    ar: 'الإلغاء (الرجوع عن قرار) — إبطال قرار سبق اتّخاذه. فقد ألغى لويس الرابع عشر مرسوم نانت أي أبطله.',
    voir: ['révoque', 'révocation', 'révoqué'],
  },
  {
    terme: 'tolérance',
    def: "Accepter que d'autres pensent, croient ou vivent autrement que soi, sans chercher à les en empêcher.",
    ar: 'التسامح — قبول أن يفكّر الآخرون أو يؤمنوا أو يعيشوا على غير ما نعيش، دون السعي إلى منعهم.',
    voir: ['intolérance', 'tolérance'],
  },
  {
    terme: 'clergé',
    def: "L'ensemble des religieux : prêtres, évêques, moines. Avant 1789, c'était le premier des trois ordres.",
    ar: 'رجال الدين — مجموع الإكليروس من كهنة وأساقفة ورهبان، وكانوا قبل 1789 الطبقةَ الأولى من الطبقات الثلاث.',
    voir: ['clergé'],
  },
  {
    terme: 'noblesse',
    def: "Les familles qui possédaient des terres et des titres transmis par la naissance : ducs, comtes, marquis. Le deuxième ordre.",
    ar: 'النبلاء — العائلات التي كانت تملك الأراضي والألقاب المتوارثة بالمولد من دوقات وكونتات وماركيزات، وهم الطبقة الثانية.',
    voir: ['noblesse', 'noble', 'nobles'],
  },
  {
    terme: 'tiers état',
    def: "Le troisième ordre : tous ceux qui n'étaient ni clergé ni noblesse — soit 98 % de la population, qui payait presque tout l'impôt.",
    ar: 'الطبقة الثالثة — من ليسوا من رجال الدين ولا من النبلاء، أي 98 بالمائة من السكّان، وكانوا يدفعون الضريبة كلّها تقريبًا.',
    voir: ['tiers état'],
  },
  {
    terme: 'privilège',
    def: "Un avantage attaché à la naissance et non au mérite : ne pas payer tel impôt, être jugé par un tribunal à part. Abolis dans la nuit du 4 août 1789.",
    ar: 'الامتياز — ميزة مرتبطة بالمولد لا بالاستحقاق: كالإعفاء من ضريبة أو المحاكمة أمام محكمة خاصّة. وقد أُلغيت ليلة 4 أغسطس 1789.',
    voir: ['privilèges', 'privilège'],
  },
  {
    terme: 'arbitraire',
    def: "Une décision prise selon le bon vouloir de quelqu'un, sans règle ni justification. Le contraire de l'État de droit.",
    ar: 'التعسّف — قرار يُتّخذ حسب هوى صاحب السلطة دون قاعدة ولا تبرير، وهو نقيض دولة القانون.',
    voir: ["l'arbitraire", 'arbitraire'],
  },
  {
    terme: 'guillotine',
    def: "La machine à décapiter utilisée pendant la Révolution et jusqu'en 1977. « Être guillotiné », c'est être exécuté par elle.",
    ar: 'المقصلة — آلة قطع الرؤوس التي استُعملت في الثورة وحتى سنة 1977، و«الإعدام بالمقصلة» هو التنفيذ بها.',
    voir: ['guillotinée', 'guillotiné', 'guillotine'],
  },
  {
    terme: 'superstition',
    def: "Une croyance sans fondement, transmise par habitude, que les philosophes des Lumières voulaient remplacer par la raison.",
    ar: 'الخرافة — اعتقاد بلا أساس يتوارثه الناس بالعادة، وقد أراد فلاسفة الأنوار استبداله بالعقل.',
    voir: ['superstition'],
  },
  {
    terme: 'tyrannie',
    def: "Un pouvoir qui s'exerce sans limite ni contrôle, au seul profit de celui qui le détient.",
    ar: 'الطغيان — سلطة تُمارَس بلا حدود ولا رقابة، لمصلحة من يمسك بها وحده.',
    voir: ['tyrannique', 'tyrannie'],
  },
  {
    terme: 'instituteur',
    def: "Le maître d'école primaire. Sous la Troisième République, on les appelait les « hussards noirs » à cause de leur blouse sombre.",
    ar: 'المعلّم الابتدائي — أستاذ المدرسة الابتدائية، وكانوا في الجمهورية الثالثة يُلقَّبون بـ«فرسان الجمهورية السود» بسبب مآزرهم الداكنة.',
    voir: ['instituteur', 'instituteurs'],
  },
  {
    terme: 'tranchée',
    def: "Un long fossé creusé dans la terre où les soldats de 1914-1918 vivaient et se battaient, parfois pendant des mois.",
    ar: 'الخندق — حفرة طويلة في الأرض كان جنود 1914-1918 يعيشون فيها ويقاتلون منها، أحيانًا لأشهر.',
    voir: ['tranchées', 'tranchée'],
  },
  {
    terme: 'rafle',
    def: "Une arrestation massive et organisée. Sous l'Occupation, la police française en a mené contre les juifs, dont celle du Vél' d'Hiv en 1942.",
    ar: 'حملة الاعتقال الجماعي — توقيف واسع منظَّم. وقد نفّذت الشرطة الفرنسية تحت الاحتلال حملات ضدّ اليهود، منها حملة «فيل ديف» سنة 1942.',
    voir: ['rafles', 'rafle'],
  },
  {
    terme: 'déporter',
    def: "Emmener de force des personnes loin de chez elles, ici vers les camps de concentration et d'extermination nazis.",
    ar: 'الترحيل القسري — نقل أشخاص عنوةً بعيدًا عن ديارهم، وهنا إلى معسكرات الاعتقال والإبادة النازية.',
    voir: ['déportés', 'déporté', 'déportation'],
  },
  {
    terme: 'collaborer',
    def: "Aider volontairement l'occupant allemand entre 1940 et 1944. C'est ce qu'a fait le régime de Vichy.",
    ar: 'التعاون مع المحتلّ — مساعدة المحتلّ الألماني طوعًا بين 1940 و1944، وهو ما فعله نظام فيشي.',
    voir: ['collabore', 'collaboration', 'collaborateur'],
  },
  {
    terme: 'urne',
    def: "La boîte transparente dans laquelle on dépose son bulletin de vote. On la garde visible pour que personne ne puisse y toucher.",
    ar: 'صندوق الاقتراع — الصندوق الشفّاف الذي تُوضع فيه ورقة التصويت، ويبقى ظاهرًا للعيان حتى لا يعبث به أحد.',
    voir: ['urne'],
  },
  {
    terme: 'assesseur',
    def: "Le bénévole qui tient la table du bureau de vote, vérifie l'identité et prononce le « a voté ».",
    ar: 'مساعد مكتب الاقتراع — متطوّع يجلس إلى طاولة مكتب التصويت، يتحقّق من الهوية ويعلن «قد صوّت».',
    voir: ['assesseur'],
  },
  {
    terme: 'bulletin de vote',
    def: "Le papier au nom d'un candidat ou d'une liste que l'on glisse dans l'enveloppe puis dans l'urne.",
    ar: 'ورقة التصويت — الورقة التي تحمل اسم مرشّح أو قائمة، تُوضع في الظرف ثمّ في صندوق الاقتراع.',
    voir: ['bulletin de vote', 'bulletins', 'bulletin'],
  },
  {
    terme: 'hémicycle',
    def: "La salle en demi-cercle où siègent les députés, avec la tribune au centre pour celui qui parle.",
    ar: 'القاعة نصف الدائرية — قاعة على شكل نصف دائرة يجلس فيها النوّاب، وفي وسطها المنبر لمن يتكلّم.',
    voir: ['hémicycle'],
  },
  {
    terme: 'prévenu',
    def: "La personne poursuivie devant un tribunal correctionnel, qui n'a pas encore été jugée. Elle est présumée innocente.",
    ar: 'المتّهم (في الجُنح) — الشخص الملاحق أمام محكمة الجنح ولم يُحكم عليه بعد، وهو بريء بحكم القرينة.',
    voir: ['prévenus', 'prévenu'],
  },
  {
    terme: 'allocation',
    def: "Une somme versée par l'État ou la CAF pour aider : allocations familiales, aide au logement, allocation chômage.",
    ar: 'المنحة (الإعانة) — مبلغ تصرفه الدولة أو صندوق المنح العائلية للمساعدة: منح عائلية، ومساعدة سكن، وتعويض بطالة.',
    voir: ['allocations', 'allocation'],
  },
  {
    terme: 'bail',
    def: "Le contrat écrit entre un propriétaire et un locataire, qui fixe le loyer, la durée et les obligations de chacun.",
    ar: 'عقد الإيجار — عقد مكتوب بين المالك والمستأجر يحدّد الكراء والمدّة والتزامات كلّ طرف.',
    voir: ['un bail', 'bail'],
  },
];

/* --------------------------------------------------------------- index */

/**
 * Toutes les formes repérables, de la plus longue à la plus courte.
 *
 * L'ordre compte : sans lui, « suffrage » serait marqué à l'intérieur de
 * « suffrage universel », et l'on perdrait la définition la plus précise.
 */
export const FORMES = GLOSSAIRE
  .flatMap((e) => e.voir.map((v) => ({ forme: v, terme: e.terme })))
  .sort((a, b) => b.forme.length - a.forme.length);

export const PAR_TERME = new Map(GLOSSAIRE.map((e) => [e.terme, e]));

export const TOTAL_TERMES = GLOSSAIRE.length;
