interface MemoryItem {

    tenantId: string;

    question: string;

    answer: string;

    intent: string;

    createdAt: number;

}

const memory = new Map<string, MemoryItem>();

export function saveConversation(

    tenantId: string,

    question: string,

    answer: string,

    intent: string

) {

    memory.set(

        tenantId,

        {

            tenantId,

            question,

            answer,

            intent,

            createdAt: Date.now(),

        }

    );

}

export function getConversation(

    tenantId: string

): MemoryItem | null {

    const item = memory.get(tenantId);

    if (!item) {

        return null;

    }

    // Expire after 15 minutes
    if (

        Date.now() - item.createdAt >

        15 * 60 * 1000

    ) {

        memory.delete(tenantId);

        return null;

    }

    return item;

}

export function clearConversation(

    tenantId: string

) {

    memory.delete(tenantId);

}