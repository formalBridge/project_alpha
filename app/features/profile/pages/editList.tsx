import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Link } from '@remix-run/react';
import { useState } from 'react';

import styles from './editList.module.scss';
import SongItem from '../components/SongItem';
import { SortableItem } from '../components/SortableItem'; // 새로 추가된 컴포넌트

export default function EditList() {
  // 초기 리스트 데이터
  const [songs, setSongs] = useState([
    { id: '1', content: <SongItem /> },
    { id: '2', content: <SongItem /> },
    { id: '3', content: <SongItem /> },
    { id: '4', content: <SongItem /> },
    { id: '5', content: <SongItem /> },
  ]);

  // DnD 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 완료 시 호출되는 함수
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 드래그가 리스트 밖으로 벗어나면 아무 작업도 하지 않음
    if (!over) return;

    if (active.id !== over.id) {
      setSongs((prevSongs) => {
        const oldIndex = prevSongs.findIndex((song) => song.id === active.id);
        const newIndex = prevSongs.findIndex((song) => song.id === over.id);
        return arrayMove(prevSongs, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <Link to="../show">Go Back</Link>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={songs.map((song) => song.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.editListContainer}>
            {songs.map((song) => (
              <SortableItem key={song.id} id={song.id}>
                {song.content}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
