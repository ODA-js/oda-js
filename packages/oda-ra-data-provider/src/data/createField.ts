export default function(data: { [key: string]: any }, field: string) {
  if (data[field] !== undefined) {
    return {
      [field]: data[field],
    };
  }
}
