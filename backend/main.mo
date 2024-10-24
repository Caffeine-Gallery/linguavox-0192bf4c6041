import Int "mo:base/Int";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    // Define the Translation type
    public type Translation = {
        sourceText: Text;
        translatedText: Text;
        targetLanguage: Text;
        timestamp: Int;
    };

    // Store translations in a stable variable
    private stable var translations : [Translation] = [];
    private let translationsBuffer = Buffer.Buffer<Translation>(0);

    // Initialize buffer with stable data
    private func loadStableData() {
        for (translation in translations.vals()) {
            translationsBuffer.add(translation);
        };
    };
    loadStableData();

    // Save a translation
    public shared func saveTranslation(sourceText: Text, translatedText: Text, targetLanguage: Text) : async Translation {
        let translation : Translation = {
            sourceText = sourceText;
            translatedText = translatedText;
            targetLanguage = targetLanguage;
            timestamp = Time.now();
        };
        translationsBuffer.add(translation);
        translation
    };

    // Get all translations
    public query func getTranslations() : async [Translation] {
        Buffer.toArray(translationsBuffer)
    };

    // System functions for upgrades
    system func preupgrade() {
        translations := Buffer.toArray(translationsBuffer);
    };

    system func postupgrade() {
        loadStableData();
    };
}
