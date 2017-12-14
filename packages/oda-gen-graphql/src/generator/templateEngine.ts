import { Factory } from 'fte.js';

export default function ({ root }) {
  return new Factory({
    root,
    debug: true,
  });
}