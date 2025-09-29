import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAdminStore } from '../state/adminStore';
import { Question } from '../types/act';

interface AddPassageScreenProps {
  navigation: any;
}

export default function AddPassageScreen({ navigation }: AddPassageScreenProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState<'English' | 'Math' | 'Reading' | 'Science'>('English');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const { addPassage } = useAdminStore();

  const handleSavePassage = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in title and content');
      return;
    }

    if (questions.length === 0) {
      Alert.alert('Error', 'Please add at least one question');
      return;
    }

    addPassage({
      title: title.trim(),
      content: content.trim(),
      subject,
      difficulty,
      questions,
    });

    Alert.alert(
      'Success',
      'Passage saved successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const addQuestion = () => {
    setIsAddingQuestion(true);
  };

  const subjects: Array<'English' | 'Math' | 'Reading' | 'Science'> = ['English', 'Math', 'Reading', 'Science'];
  const difficulties: Array<'Easy' | 'Medium' | 'Hard'> = ['Easy', 'Medium', 'Hard'];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </Pressable>
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Add New Passage
            </Text>
          </View>
          <Pressable
            onPress={handleSavePassage}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Save</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 pt-4">
          {/* Basic Info */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Passage Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter passage title"
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Subject Selection */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              Subject
            </Text>
            <View className="flex-row flex-wrap space-x-2">
              {subjects.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSubject(s)}
                  className={`px-4 py-2 rounded-lg border mb-2 ${
                    subject === s 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`font-medium ${
                    subject === s ? 'text-white' : 'text-gray-700'
                  }`}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Difficulty Selection */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              Difficulty
            </Text>
            <View className="flex-row space-x-2">
              {difficulties.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg border ${
                    difficulty === d 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`font-medium ${
                    difficulty === d ? 'text-white' : 'text-gray-700'
                  }`}>
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Content */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Passage Content
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Enter the passage content that students will read..."
              multiline
              numberOfLines={8}
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          {/* Questions */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-gray-700">
                Questions ({questions.length})
              </Text>
              <Pressable
                onPress={addQuestion}
                className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
              >
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-semibold ml-1">Add Question</Text>
              </Pressable>
            </View>

            {questions.map((question, index) => (
              <View key={index} className="bg-gray-50 p-4 rounded-xl mb-3">
                <Text className="font-semibold text-gray-900 mb-2">
                  Question {question.questionNumber}: {question.text}
                </Text>
                <Text className="text-sm text-gray-600">
                  Correct Answer: {question.correctAnswer}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Add Question Modal would go here */}
        {isAddingQuestion && (
          <AddQuestionModal
            onClose={() => setIsAddingQuestion(false)}
            onSave={(question) => {
              const questionWithId: Question = {
                ...question,
                id: `question_${Date.now()}`,
              };
              setQuestions(prev => [...prev, questionWithId]);
              setIsAddingQuestion(false);
            }}
            questionNumber={questions.length + 1}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Simple Add Question Modal Component
interface AddQuestionModalProps {
  onClose: () => void;
  onSave: (question: Omit<Question, 'id'>) => void;
  questionNumber: number;
}

function AddQuestionModal({ onClose, onSave, questionNumber }: AddQuestionModalProps) {
  const [text, setText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  const handleSave = () => {
    if (!text.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim() || !explanation.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    onSave({
      questionNumber,
      text: text.trim(),
      options: {
        A: optionA.trim(),
        B: optionB.trim(),
        C: optionC.trim(),
        D: optionD.trim(),
      },
      correctAnswer,
      explanation: explanation.trim(),
    });
  };

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center">
      <View className="bg-white m-6 rounded-2xl p-6 max-h-4/5">
        <ScrollView>
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Add Question {questionNumber}
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-1">Question Text</Text>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Enter question text"
                multiline
                className="border border-gray-300 rounded-lg px-3 py-2 text-base"
              />
            </View>

            {['A', 'B', 'C', 'D'].map((letter) => (
              <View key={letter}>
                <Text className="text-sm font-semibold text-gray-700 mb-1">Option {letter}</Text>
                <TextInput
                  value={letter === 'A' ? optionA : letter === 'B' ? optionB : letter === 'C' ? optionC : optionD}
                  onChangeText={(value) => {
                    if (letter === 'A') setOptionA(value);
                    else if (letter === 'B') setOptionB(value);
                    else if (letter === 'C') setOptionC(value);
                    else setOptionD(value);
                  }}
                  placeholder={`Enter option ${letter}`}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                />
              </View>
            ))}

            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Correct Answer</Text>
              <View className="flex-row space-x-2">
                {['A', 'B', 'C', 'D'].map((letter) => (
                  <Pressable
                    key={letter}
                    onPress={() => setCorrectAnswer(letter as 'A' | 'B' | 'C' | 'D')}
                    className={`px-4 py-2 rounded-lg border ${
                      correctAnswer === letter 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`font-medium ${
                      correctAnswer === letter ? 'text-white' : 'text-gray-700'
                    }`}>
                      {letter}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-1">Explanation</Text>
              <TextInput
                value={explanation}
                onChangeText={setExplanation}
                placeholder="Explain why this is the correct answer"
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                textAlignVertical="top"
              />
            </View>
          </View>

          <View className="flex-row space-x-3 mt-6">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-300 py-3 rounded-lg items-center"
            >
              <Text className="font-semibold text-gray-700">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-blue-600 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Save Question</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}