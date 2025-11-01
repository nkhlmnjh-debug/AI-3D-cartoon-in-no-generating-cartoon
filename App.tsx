
import React, { useState, useCallback } from 'react';
import { Scene } from './types';
import { STORY_SCENES } from './constants';
import { generateImageForScene } from './services/geminiService';
import StoryScene from './components/StoryScene';
import Loader from './components/Loader';

const initialScenes: Scene[] = STORY_SCENES.map(scene => ({
  ...scene,
  imageUrl: null,
}));

const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStorybook = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    const imageGenerationPromises = scenes.map(scene => {
        if (scene.imageUrl) {
            return Promise.resolve(scene.imageUrl);
        }
        return generateImageForScene(scene.prompt);
    });

    try {
      const imageUrls = await Promise.all(imageGenerationPromises);
      const updatedScenes = scenes.map((scene, index) => ({
        ...scene,
        imageUrl: imageUrls[index],
      }));
      setScenes(updatedScenes);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during image generation.');
      }
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [scenes]);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-600">🐱🐶 बिल्ली और कुत्ते की कहानी</h1>
          <p className="text-xl md:text-2xl text-stone-600 mt-2">An AI Illustrated Storybook</p>
        </header>

        <div className="space-y-8">
          {scenes.map(scene => (
            <StoryScene key={scene.id} scene={scene} isGeneratingAll={isGenerating} />
          ))}
        </div>

        <section className="text-center mt-12 p-8 bg-white rounded-2xl shadow-lg border-2 border-amber-200">
            <h2 className="text-3xl font-bold text-amber-600 mb-2">🌟 कहानी से सीख 🌟</h2>
            <p className="text-xl md:text-2xl text-stone-700">सच्ची समझ और दोस्ती दिल से आती है, दिमाग से नहीं।</p>
        </section>

      </main>

      <footer className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 shadow-top-md border-t border-amber-200">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          {error && <p className="text-red-600 bg-red-100 px-4 py-2 rounded-lg text-center">{error}</p>}
          <button
            onClick={handleGenerateStorybook}
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:bg-stone-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
          >
            {isGenerating ? (
              <>
                <Loader size="h-6 w-6" />
                <span>Generating Storybook...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-5.747h11.494" />
                </svg>
                <span>Illustrate Storybook</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
