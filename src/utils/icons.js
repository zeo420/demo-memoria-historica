import {
  // General
  FaUser, FaTrophy, FaStar, FaBullseye, FaEdit, FaChartBar,
  FaHistory, FaVideo, FaHeart, FaRegHeart, FaSearch, FaEye,
  FaCheckCircle, FaTimesCircle, FaChartLine, FaAward, FaMedal,
  FaCrown, FaFire, FaClock, FaCalendarAlt, FaMapMarkerAlt,
  FaGlobeAmericas, FaUsers, FaUserFriends, FaUserGraduate,
  FaUserTie, FaUserCheck, FaUserClock, FaQuestionCircle,
  FaHome, FaBook, FaMap, FaPlay, FaPause, FaStop,
  FaForward, FaBackward, FaExpand, FaCompress, FaVolumeUp,
  FaVolumeMute, FaDownload, FaUpload, FaShare, FaCopy,
  FaTrash, FaSave, FaTimes, FaPlus, FaMinus, FaFilter,
  FaSort, FaSortUp, FaSortDown, FaChevronRight, FaChevronLeft,
  FaChevronUp, FaChevronDown, FaArrowRight, FaArrowLeft,
  FaExclamationCircle, FaInfoCircle, FaQuestion,
  
  // Categorías específicas
  FaLandmark, FaFistRaised, FaPalette, FaMoneyBillWave,
  FaUniversity, FaMask, FaTheaterMasks, FaBookOpen,
  FaGraduationCap, FaMicroscope, FaFlask, FaAtom,
  FaMountain, FaTree, FaWater, FaSun, FaMoon,
  
  // Social y comunicación
  FaComment, FaComments, FaEnvelope, FaPaperPlane,
  FaThumbsUp, FaThumbsDown, FaFlag, FaShareAlt,
  FaRetweet, FaReply, FaQuoteRight,
  
  // Navegación y UI
  FaBars, FaTimes, FaEllipsisH, FaEllipsisV,
  FaCog, FaWrench, FaSlidersH, FaTools,
  FaBell, FaEnvelopeOpen, FaInbox, FaOutdent,
  
  // Archivos y documentos
  FaFile, FaFileAlt, FaFilePdf, FaFileWord,
  FaFileExcel, FaFilePowerpoint, FaFileImage,
  FaFileAudio, FaFileVideo, FaFolder, FaFolderOpen,
  
  // Geolocalización
  FaLocationArrow, FaCompass, FaMapMarked, FaMapPin,
  
  // Educación y aprendizaje
  FaChalkboardTeacher, FaUserNinja, FaUserSecret,
  FaUserAstronaut, FaUserMd, FaUserNurse
} from 'react-icons/fa';

import {
  MdEmail, MdPerson, MdTimer, MdTrendingUp,
  MdSchool, MdWorkspaces, MdHistory, MdDashboard,
  MdSettings, MdHelp, MdExitToApp, MdLogin,
  MdLock, MdLockOpen, MdVisibility, MdVisibilityOff,
  MdVerifiedUser, MdAdminPanelSettings, MdSupervisorAccount,
  MdGroup, MdPersonAdd, MdPeople, MdPublic,
  MdLanguage, MdTranslate, MdMenuBook, MdLibraryBooks,
  MdLocalLibrary, MdScience, MdBiotech, MdPsychology,
  MdCalculate, MdFunctions, MdCode, MdComputer,
  MdSmartphone, MdTablet, MdTv, MdHeadset,
  MdKeyboard, MdMouse, MdPrint, MdScanner,
  MdStorage, MdSdStorage, MdCloud, MdCloudUpload,
  MdCloudDownload, MdWifi, MdBluetooth, MdSignalCellularAlt,
  MdBatteryFull, MdPower, MdPowerOff, MdRestartAlt,
  MdUpdate, MdDownload, MdUpload, MdAttachFile,
  MdLink, MdInsertLink, MdInsertPhoto, MdInsertDriveFile,
  MdFormatQuote, MdFormatListBulleted, MdFormatListNumbered,
  MdChecklist, MdAssignment, MdAssignmentTurnedIn,
  MdQuiz, MdQuestionAnswer, MdFeedback, MdRateReview,
  MdStar, MdStarHalf, MdStarBorder, MdGrade,
  MdWorkspacePremium, MdEmojiEvents, MdMilitaryTech,
  MdSecurity, MdShield, MdVerified, MdGppGood,
  MdGppMaybe, MdGppBad, MdPolicy, MdPrivacyTip,
  MdReport, MdFlag, MdOutlineFlag, MdOutlineReport
} from 'react-icons/md';

import {
  GiLaurelsTrophy, GiRank3, GiRank2, GiRank1,
  GiCrossedSwords, GiCastle, GiScroll, GiAncientColumns,
  GiPyramid, GiEgyptianTemple, GiRomanToga, GiKnightBanner,
  GiPistolGun, GiCannon, GiTank, GiHelicopter,
  GiFactory, GiMineTruck, GiOilPump, GiMoneyStack,
  GiProtest, GiMegaphone, GiPublicSpeaker, GiSpeaker,
  GiTheater, GiFilmProjector, GiMusicalNotes, GiPainting,
  GiSculpture, GiAbstract, GiModernArt, GiClayBrick
} from 'react-icons/gi';

// Exportar por categorías
export const IconosGenerales = {
  user: FaUser,
  trophy: FaTrophy,
  star: FaStar,
  target: FaBullseye,
  edit: FaEdit,
  chart: FaChartBar,
  history: FaHistory,
  video: FaVideo,
  heart: FaHeart,
  heartOutline: FaRegHeart,
  search: FaSearch,
  eye: FaEye,
  check: FaCheckCircle,
  times: FaTimesCircle,
  trend: FaChartLine,
  award: FaAward,
  medal: FaMedal,
  crown: FaCrown,
  fire: FaFire,
  clock: FaClock,
  calendar: FaCalendarAlt,
  location: FaMapMarkerAlt,
  globe: FaGlobeAmericas,
  users: FaUsers,
  question: FaQuestionCircle
};

export const IconosCategorias = {
  politico: FaUserTie,
  conflicto: GiCrossedSwords,
  social: FaUsers,
  cultural: MdSchool,
  economico: MdTrendingUp
};

export const IconosMedallas = {
  nivel: FaStar,
  perfeccion: FaCheckCircle,
  experto: FaUserGraduate,
  perseverante: FaUserClock,
  maestro: FaCrown,
  racha: FaFire,
  default: FaMedal
};

export const IconosRanking = {
  first: GiRank1,
  second: GiRank2,
  third: GiRank3
};

// Función helper para obtener iconos
export const getIcono = (tipo, categoria = null) => {
  const iconos = {
    // General
    'user': IconosGenerales.user,
    'trophy': IconosGenerales.trophy,
    'star': IconosGenerales.star,
    'target': IconosGenerales.target,
    'edit': IconosGenerales.edit,
    'chart': IconosGenerales.chart,
    'history': IconosGenerales.history,
    'video': IconosGenerales.video,
    'heart': IconosGenerales.heart,
    'heart-outline': IconosGenerales.heartOutline,
    'search': IconosGenerales.search,
    'eye': IconosGenerales.eye,
    'check': IconosGenerales.check,
    'times': IconosGenerales.times,
    'trend': IconosGenerales.trend,
    'award': IconosGenerales.award,
    'medal': IconosGenerales.medal,
    'crown': IconosGenerales.crown,
    'fire': IconosGenerales.fire,
    'clock': IconosGenerales.clock,
    'calendar': IconosGenerales.calendar,
    'location': IconosGenerales.location,
    'globe': IconosGenerales.globe,
    'users': IconosGenerales.users,
    'question': IconosGenerales.question,
    
    // Categorías
    'politico': IconosCategorias.politico,
    'conflicto': IconosCategorias.conflicto,
    'social': IconosCategorias.social,
    'cultural': IconosCategorias.cultural,
    'economico': IconosCategorias.economico,
    
    // Medallas
    'medal-nivel': IconosMedallas.nivel,
    'medal-perfeccion': IconosMedallas.perfeccion,
    'medal-experto': IconosMedallas.experto,
    'medal-perseverante': IconosMedallas.perseverante,
    'medal-maestro': IconosMedallas.maestro,
    'medal-racha': IconosMedallas.racha,
    'medal-default': IconosMedallas.default,
    
    // Ranking
    'rank-first': IconosRanking.first,
    'rank-second': IconosRanking.second,
    'rank-third': IconosRanking.third
  };
  
  return iconos[tipo] || iconos[categoria] || IconosGenerales.question;
};