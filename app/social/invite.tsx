import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { useBeBuddy } from '../../hooks/useBeBuddy';
import { Mail, ArrowLeft, UserPlus, Check } from 'lucide-react-native';

export default function InviteBuddy() {
    const router = useRouter();
    const { sendBuddyInvite, incomingRequests, acceptBuddyRequest, loading } = useBeBuddy();
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Invite a Buddy</Text>
                <Button
                    title="Back"
                    onPress={() => router.back()}
                    variant="outline"
                    style={{ marginLeft: 'auto' }}
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Send Invite</Text>
                <Text style={styles.description}>
                    Enter your friend's email address to invite them to a BE Buddy Challenge.
                </Text>

                <View style={styles.inputContainer}>
                    <Mail color={Colors.textSecondary} size={20} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="friend@example.com"
                        placeholderTextColor={Colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <Button
                    title="Send Invitation"
                    onPress={() => sendBuddyInvite(email)}
                    style={{ marginTop: 10 }}
                    icon={UserPlus}
                />

                {incomingRequests.length > 0 && (
                    <View style={styles.requestsSection}>
                        <Text style={styles.sectionTitle}>Pending Requests</Text>
                        <FlatList
                            data={incomingRequests}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.requestItem}>
                                    <View>
                                        <Text style={styles.requestName}>{item.fromName}</Text>
                                        <Text style={styles.requestEmail}>{item.fromEmail}</Text>
                                    </View>
                                    <Button
                                        title="Accept"
                                        onPress={() => acceptBuddyRequest(item)}
                                        style={styles.acceptButton}
                                        icon={Check}
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
        marginTop: 20,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 12, // Match Input component
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: Colors.text,
        fontSize: 16,
    },
    requestsSection: {
        marginTop: 40,
        flex: 1,
    },
    requestItem: {
        backgroundColor: Colors.surface,
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    requestName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    requestEmail: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    acceptButton: {
        paddingHorizontal: 15,
        height: 40,
    }
});
