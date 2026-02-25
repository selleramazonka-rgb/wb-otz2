PR: Fix Unpack Feedbacks and Send Answer to WB

Что сделано:
- Исправлена нода `Unpack Feedbacks`: теперь сохраняется существующее `customerName` и добавляется `productName` из `productDetails`, если отсутствует.
- В `Send Answer to WB` добавлено поле `reviewId` (fallback на `id`).
- Добавлен временный `Debug: Log Before Send` нода для проверки `id` и текста перед отправкой.
- Добавлены fallback-поля для текста ответа (output/text/answer/choices).

Почему:
- Ранее `customerName` затирался и `productName` не попадал в prompt, что могло приводить к пустым ответам или отсутствию упоминания товара/имени в ответе.
- Поле `reviewId` добавлено в тело запроса для совместимости с API и корректного сопоставления отзыва.

Как протестировать:
1. Импортировать `WB Auto OK Reply OpenRouter (STABLE).json` в n8n.
2. Выполнить `Execute Workflow` (ручной запуск).
3. В последнем исполнении открыть ноду `Debug: Log Before Send` — проверить `debug_id` и `debug_text`.
4. Открыть ноду `Send Answer to WB` — убедиться, что Request Body содержит `id`, `reviewId`, `text`.
5. При успешном ответе (204) выполнить GET на feedbacks API для проверки, что поле `answer` установлено.

Дальнейшие шаги:
- После валидации удалить или отключить `Debug: Log Before Send`.
- (Опционально) создать PR в репозиторий и попросить коллег проверить изменения в n8n.
