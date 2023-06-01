"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Функція для підключення до бази даних
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client({
            user: 'postgres',
            password: '1234',
            host: 'localhost',
            database: 'users',
            port: 5433, // Порт з'єднання з базою даних PostgreSQL
        });
        yield client.connect();
        return client;
    });
}
// Запит 1: Список усіх користувачів із їхніми каналами, відсортований за датою створення каналу
function getUsersWithChannels() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDatabase();
        const query = `
    SELECT users.id AS user_id, users.name AS user_name, users.avatar_url AS user_avatar, channels.photo_url AS channel_photo, channels.description AS channel_description, channels.created_at AS channel_creation_date
    FROM users
    JOIN channels ON users.id = channels.user_id
    ORDER BY channels.created_at DESC;
  `;
        const result = yield client.query(query);
        //console.log('Users with channels:', result.rows);
        yield client.end();
    });
}
// Запит 2: Дані про 5 відео, які найбільше сподобалися
function getTopLikedVideos() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDatabase();
        const query = `
    SELECT videos.id AS video_id, videos.title AS video_title, videos.preview_url AS video_preview, videos.duration AS video_duration, videos.published_at AS video_publish_date
    FROM videos
    JOIN likes ON videos.id = likes.video_id
    ORDER BY likes.positive DESC
    LIMIT 5;
  `;
        const result = yield client.query(query);
        //console.log('Top liked videos:', result.rows);
        yield client.end();
    });
}
// Запит 3: Список відео від підписки користувача Stephanie Bulger, впорядкований за датою публікації
function getVideosFromSubscription() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDatabase();
        const query = `
    SELECT videos.id AS video_id, videos.title AS video_title, videos.preview_url AS video_preview, videos.duration AS video_duration, videos.published_at AS video_publish_date
    FROM videos
    JOIN channels ON videos.channel_id = channels.id
    JOIN subscriptions ON channels.id = subscriptions.channel_id
    JOIN users ON subscriptions.user_id = users.id
    WHERE users.name = 'Stephanie Bulger'
    ORDER BY videos.published_at DESC;
  `;
        const result = yield client.query(query);
        //console.log('Videos from Stephanie Bulger\'s subscription:', result.rows);
        yield client.end();
    });
}
// Запит 4: Дані каналу з ідентифікатором '79f6ce8f-ee0c-4ef5-9c36-da06b7f4cb76' і кількість його підписників
function getChannelInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDatabase();
        const query = `
    SELECT channels.*, COUNT(subscriptions.user_id) AS subscriber_count
    FROM channels
    LEFT JOIN subscriptions ON channels.id = subscriptions.channel_id
    WHERE channels.id = '79f6ce8f-ee0c-4ef5-9c36-da06b7f4cb76'
    GROUP BY channels.id;
  `;
        const result = yield client.query(query);
        //console.log('Channel info:', result.rows[0]);
        yield client.end();
    });
}
// Запит 5: Список 10 найбільш оцінюваних відео з позитивними оцінками, починаючи з вересня 2021 року, впорядкований за кількістю оцінок
function getTopRatedVideos() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDatabase();
        const query = `
    SELECT videos.id AS video_id, videos.title AS video_title, videos.preview_url AS video_preview, videos.duration AS video_duration, videos.published_at AS video_publish_date, COUNT(likes.video_id) AS like_count
    FROM videos
    JOIN likes ON videos.id = likes.video_id
    WHERE likes.positive = true AND videos.published_at >= '2021-09-01'
    GROUP BY videos.id
    HAVING COUNT(likes.video_id) > 4
    ORDER BY like_count DESC
    LIMIT 10;
  `;
        const result = yield client.query(query);
        console.log('Top rated videos:', result.rows);
        yield client.end();
    });
}
// Запит 6: Список даних з підписок користувача Ennis Haestier
function getSubscriptionsForUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDatabase();
        const query = `
    SELECT users.name AS channel_name, users.avatar_url AS channel_avatar, channels.photo_url AS channel_photo, channels.description AS channel_description, subscriptions.level AS subscription_level, subscriptions.subscribed_at AS subscription_date
    FROM users
    JOIN subscriptions ON users.id = subscriptions.user_id
    JOIN channels ON subscriptions.channel_id = channels.id
    WHERE users.name = 'Ennis Haestier'
    ORDER BY subscriptions.level DESC, subscriptions.subscribed_at DESC;
  `;
        const result = yield client.query(query);
        console.log('Subscriptions for Ennis Haestier:', result.rows);
        yield client.end();
    });
}
// Виклик функцій для виконання запитів
getUsersWithChannels();
getTopLikedVideos();
getVideosFromSubscription();
getChannelInfo();
getTopRatedVideos();
getSubscriptionsForUser();
