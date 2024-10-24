export const idlFactory = ({ IDL }) => {
  const Translation = IDL.Record({
    'sourceText' : IDL.Text,
    'targetLanguage' : IDL.Text,
    'translatedText' : IDL.Text,
    'timestamp' : IDL.Int,
  });
  return IDL.Service({
    'getTranslations' : IDL.Func([], [IDL.Vec(Translation)], ['query']),
    'saveTranslation' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Translation],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
