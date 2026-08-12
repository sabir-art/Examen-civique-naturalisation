/**
 * Bibliothèque de composants du système de design Civica.
 *
 * L'arborescence reprend celle du système fourni : `core`, `forms`, `data`,
 * `navigation`, `learning`, `feedback`. Les noms, les propriétés et les
 * variantes sont ceux des fichiers `.jsx` livrés — une vue qui compose
 * `Card`, `Chip` et `ThemeCard` ici écrit la même chose que la maquette du
 * système, à la syntaxe près.
 *
 * Ce que le système ne couvre pas (le récit, le glossaire, la lecture en
 * arabe, l'assistant, la recherche, les illustrations) est construit AVEC ces
 * composants, jamais à côté d'eux.
 *
 * `PhoneFrame` n'est pas porté : c'est un cadre de présentation pour montrer
 * un écran dans une planche, pas de l'interface de produit.
 */

export {
  Icon, Button, IconButton, Chip, Badge, Card, Avatar, AvatarStack, IconTile, SectionHeader,
} from './core.js';

export { TextField, Switch } from './forms.js';

export { ProgressBar, ProgressRing, StatTile, StreakCalendar } from './data.js';

export { TopBar, BottomNav, SegmentedControl } from './navigation.js';

export { ThemeCard, QuestionCard, AnswerOption, LessonRow, ResultBanner } from './learning.js';

export { Sheet } from './feedback.js';
