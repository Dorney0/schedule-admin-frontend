type EntityName =
    | 'Cabinet'
    | 'ChangeLog'
    | 'Class'
    | 'Curriculum'
    | 'Employee'
    | 'Preference'
    | 'Schedule'
    | 'Subject'
    | 'SubjectCabinet'
    | 'SubjectEmployee';

const baseUrl = 'http://localhost:5252/api';

function getBaseUrl(entity: EntityName): string {
    // Для простых сущностей базовый url /api/EntityName
    // Для сложных с составными ключами можно расширять
    switch (entity) {
        case 'SubjectCabinet':
            return `${baseUrl}/SubjectCabinet`;
        case 'SubjectEmployee':
            return `${baseUrl}/SubjectEmployee`;
        default:
            return `${baseUrl}/${entity}`;
    }
}

// Универсальная функция fetch с проверкой статуса и JSON
async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Ошибка HTTP ${res.status}: ${errText}`);
    }
    return res.json();
}

export async function getAll<T>(entity: EntityName): Promise<T[]> {
    return request<T[]>(getBaseUrl(entity));
}

export async function getById<T>(
    entity: EntityName,
    id: number | string,
    id2?: number | string
): Promise<T> {
    let url = getBaseUrl(entity);
    if (id2 !== undefined) {
        // Для составных ключей
        url += `/${id}/${id2}`;
    } else {
        url += `/${id}`;
    }
    return request<T>(url);
}

export async function create<T>(entity: EntityName, data: T): Promise<T> {
    return request<T>(getBaseUrl(entity), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export async function update<T>(
    entity: EntityName,
    id: number | string,
    data: T,
    id2?: number | string
): Promise<T> {
    let url = getBaseUrl(entity);
    if (id2 !== undefined) {
        url += `/${id}/${id2}`;
    } else {
        url += `/${id}`;
    }
    return request<T>(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export async function remove(
    entity: EntityName,
    id: number | string,
    id2?: number | string
): Promise<void> {
    let url = getBaseUrl(entity);
    if (id2 !== undefined) {
        url += `/${id}/${id2}`;
    } else {
        url += `/${id}`;
    }
    await request<void>(url, { method: 'DELETE' });
}
