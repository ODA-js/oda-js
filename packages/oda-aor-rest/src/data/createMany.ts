export default function (data, field) {
  const fieldIds = field + 'Ids';
  if (data[fieldIds] !== undefined && Array.isArray(data[fieldIds]) && data[fieldIds].length > 0) {
    return {
      [field]: data[fieldIds].map(f => ({ id: f })),
    };
  }
}
