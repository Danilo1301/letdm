import { join } from "path";

export const PATH_ROOT = join(process.cwd());
export const PATH_SRC = join(PATH_ROOT, 'src');
export const PATH_PUBLIC = join(PATH_ROOT, 'public');
export const PATH_CLIENT = join(PATH_PUBLIC, 'client');
export const PATH_DATA = join(PATH_ROOT, '.data');
export const PATH_UPLOADS = join(PATH_ROOT, 'uploads');