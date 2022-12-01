import { useState, useRef } from "react";

import { getRandomQuote, QUOTE_TYPES } from "@utils";
import { Input, Button } from "@components";
import { CheckIcon } from "@icons";
import { useWorkspace } from "@hooks";
import { LIMITS } from "@constants/limits";

export function AddCardButton({ fieldId }: { fieldId: string }) {
  const randomCardPlaceholder = useRef(
    getRandomQuote(QUOTE_TYPES.WORKSPACE_CARD_TITLE)
  );
  const [input, setInput] = useState("");
  const workspace = useWorkspace();

  function addCard() {
    setInput("");
    randomCardPlaceholder.current = getRandomQuote(
      QUOTE_TYPES.WORKSPACE_CARD_TITLE
    );
    if (input.length < LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH) {
      return;
    }
    if (input.length > LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH) {
      workspace.card.add({ card: { desc: input }, id: fieldId });
    } else {
      workspace.card.add({ card: { title: input }, id: fieldId });
    }
  }

  return (
    <div className="flex flex-col relative w-full opacity-0 hover:opacity-100 transition-all ease-in-out pb-2">
      {input.length < LIMITS.MIN.WORKSPACE_CARD_DESC_CHARACTER_LENGTH ||
      input.length > LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH ? (
        <div
          className="absolute right-2 top-1 z-10 text-[12px] rounded-full bg-neutral-200 dark:bg-neutral-600 px-1"
          title={`Input must be between min ${LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH} and max ${LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH} characters.`}
        >
          ?
        </div>
      ) : (
        <div
          className="absolute right-2 top-1 z-10 text-[12px] rounded-full bg-neutral-200 dark:bg-neutral-600 px-1"
          title={`Input must be between min ${LIMITS.MIN.WORKSPACE_CARD_DESC_CHARACTER_LENGTH} and max ${LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH} characters.`}
        >
          {`${input.length} / ${LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH}`}
        </div>
      )}
      <Input
        textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onEnterPress={() =>
          input.length >= LIMITS.MIN.WORKSPACE_CARD_DESC_CHARACTER_LENGTH &&
          addCard()
        }
        height="h-20"
        className="p-2 py-2 px-2 z-0"
        placeholder={randomCardPlaceholder.current}
        maxLength={LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH}
      />
      {input.length > LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH &&
        input.length <= LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH && (
          <div className="flex flex-row mt-2 justify-end">
            <Button onClick={addCard} size="sm">
              <CheckIcon size={24} fill="currentColor" />
              Add Card
            </Button>
          </div>
        )}
    </div>
  );
}
