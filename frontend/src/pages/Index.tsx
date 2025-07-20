import ChatBox from '@/components/ChatBox';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="md:text-4xl text-2xl font-bold p-1 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Chat Box gemini AI
          </h1>
          <p className="md:text-xl text-sm text-muted-foreground">
            Aplikasi chat AI dengan model gemini AI PRO
          </p>
        </div>

        <div className="flex justify-center animate-slide-up">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Index;
