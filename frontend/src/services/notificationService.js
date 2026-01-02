import { supabase } from "../../supabase/supabase";

/**
 * Fetch all notifications for a specific user.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Array>} - List of notifications.
 */
export async function getMyNotifications(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
    return data;
}

/**
 * Mark a specific notification as read.
 * @param {number} notificationId 
 */
export async function markNotificationAsRead(notificationId) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

/**
 * Mark all notifications for a user as read.
 * @param {string} userId 
 */
export async function markAllNotificationsAsRead(userId) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);

    if (error) {
        console.error('Error marking all as read:', error);
        throw error;
    }
}
