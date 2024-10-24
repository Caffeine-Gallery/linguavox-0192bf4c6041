import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Translation {
  'sourceText' : string,
  'targetLanguage' : string,
  'translatedText' : string,
  'timestamp' : bigint,
}
export interface _SERVICE {
  'getTranslations' : ActorMethod<[], Array<Translation>>,
  'saveTranslation' : ActorMethod<[string, string, string], Translation>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
