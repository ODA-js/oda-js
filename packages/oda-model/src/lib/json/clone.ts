import clean from './clean';

export default function clone(obj) {
  return JSON.parse(JSON.stringify(clean(obj)));
}
