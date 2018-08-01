import unbase64 from './unbase64';
import base64 from './base64';

export interface ResolvedGlobalId {
  type: string;
  id: string;
}

export function fromGlobalId(globalId: string): ResolvedGlobalId {
  const unbasedGlobalId = unbase64(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(':');
  if (delimiterPos > -1) {
    return {
      type: unbasedGlobalId.substring(0, delimiterPos),
      id: unbasedGlobalId.substring(delimiterPos + 1),
    };
  } else {
    return {
      type: '',
      id: globalId,
    };
  }
}

export function toGlobalId(type: string, id: string): string {
  const ub = unbase64(id);
  if (ub.indexOf(':') !== -1) {
    id = fromGlobalId(id).id;
  }
  return base64([type, id].join(':'));
}
