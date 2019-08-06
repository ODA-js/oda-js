import { CursorType } from './cursor';
import { DIRECTION } from './consts';
export default function direction({ orderBy, last, before, first, after, }: CursorType): {
    [key: string]: DIRECTION;
};
//# sourceMappingURL=direction.d.ts.map