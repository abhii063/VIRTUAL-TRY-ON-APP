
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { generateTryOnImage } from './services/geminiService';
import { PersonIcon, OutfitIcon } from './components/icons';

const LoadingView: React.FC = () => {
    const messages = useMemo(() => [
        "Styling your look...",
        "Applying the fabric of reality...",
        "Just a moment, fashion is complex!",
        "Generating your virtual fit...",
        "Our AI stylist is working its magic...",
    ], []);
    const [message, setMessage] = useState(messages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 3000);
        return () => clearInterval(interval);
    }, [messages]);
    
    return (
        <div className="flex flex-col items-center justify-center text-center h-full">
            <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-medium text-gray-800">{message}</p>
            <p className="text-gray-500 mt-2">This may take a minute. Please don't close the window.</p>
        </div>
    );
};

const App: React.FC = () => {
    const [personImage, setPersonImage] = useState<string | null>(null);
    const [outfitImage, setOutfitImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTryOn = useCallback(async () => {
        if (!personImage || !outfitImage) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateTryOnImage(personImage, outfitImage);
            setGeneratedImage(result);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? `Generation failed: ${e.message}` : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [personImage, outfitImage]);

    const handleReset = useCallback(() => {
        setPersonImage(null);
        setOutfitImage(null);
        setGeneratedImage(null);
        setError(null);
        setIsLoading(false);
    }, []);
    
    const renderContent = () => {
        if (isLoading) {
            return <LoadingView />;
        }

        if (generatedImage || error) {
            return (
                <div className="flex flex-col items-center animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{error ? 'Oops!' : 'Here Is Your New Look!'}</h2>
                    {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg max-w-lg text-center mb-6">{error}</p>}
                    {generatedImage && (
                        <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-200">
                             <img src={generatedImage} alt="Generated try-on" className="rounded-2xl max-w-sm w-full h-auto object-contain" style={{maxHeight: '60vh'}}/>
                        </div>
                    )}
                    <Button onClick={handleReset} className="mt-8">
                        Try Another Outfit
                    </Button>
                </div>
            );
        }

        return (
            <div className="w-full animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <ImageUploader 
                        title="Upload Your Photo" 
                        onImageUpload={setPersonImage} 
                        icon={<PersonIcon />} 
                        uploadedImage={personImage}
                    />
                    <ImageUploader 
                        title="Upload Outfit" 
                        onImageUpload={setOutfitImage} 
                        icon={<OutfitIcon />} 
                        uploadedImage={outfitImage}
                    />
                </div>
                <div className="flex justify-center">
                    <Button onClick={handleTryOn} disabled={!personImage || !outfitImage}>
                        Virtually Try On
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
            <Header />
            <main className="w-full max-w-5xl flex-grow flex flex-col justify-center items-center mt-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
