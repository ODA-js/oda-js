export default function (data, field, resource, resources) {
  const fieldIds = field + 'Ids';
  const fieldValues = field + 'Values';
  if (data[fieldIds] !== undefined && Array.isArray(data[fieldIds]) && data[fieldIds].length > 0) {
    return {
      [field]: data[fieldIds].map(f => ({ id: f })),
    };
  } else {
    if (data[fieldValues] !== undefined && Array.isArray(data[fieldValues]) && data[fieldValues].length > 0) {
      return {
        [field]: data[fieldValues].map(value => resources[resource].CREATE.variables({ data: value }).input),
      };
    }
  }
}
