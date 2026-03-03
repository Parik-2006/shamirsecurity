// frontend/src/utils.js
export function getErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  try { return JSON.stringify(err); } catch (e) { return String(err); }
}

export function safeJSONParse(text) {
  try { return JSON.parse(text); } catch (e) { return null; }
}
