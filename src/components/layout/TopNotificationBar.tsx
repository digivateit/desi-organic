import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TopNotificationBarProps {
  messages?: string[];
}

const TopNotificationBar = ({ messages = [] }: TopNotificationBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const defaultMessages = [
    "🌿 সম্পূর্ণ অর্গানিক ও প্রাকৃতিক পণ্য - কোনো রাসায়নিক নেই!",
    "🚚 ঢাকায় ৬০ টাকা ও ঢাকার বাইরে ১২০ টাকা ডেলিভারি চার্জ",
    "💯 ১০০% মানি ব্যাক গ্যারান্টি - সন্তুষ্ট না হলে টাকা ফেরত!",
    "🎁 ৩টি পণ্য কিনলে ৫% ছাড়, ৫টি কিনলে ১০% ছাড়!"
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 relative overflow-hidden">
      <div className="flex items-center justify-center">
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-flex animate-slide-left">
            {displayMessages.map((msg, idx) => (
              <span key={idx} className="mx-8 text-sm font-medium">
                {msg}
              </span>
            ))}
            {displayMessages.map((msg, idx) => (
              <span key={`dup-${idx}`} className="mx-8 text-sm font-medium">
                {msg}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TopNotificationBar;
