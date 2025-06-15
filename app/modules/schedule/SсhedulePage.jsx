import { useEffect, useState } from 'react';
import { getWeeklySchedule } from '../../api/scheduleApi';

function SchedulePage() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        getWeeklySchedule().then(setSchedule);
    }, []);

    return (
        <div>
            <h1>Расписание на неделю</h1>
            <ul>
                {schedule.map((item, index) => (
                    <li key={index}>
                        {item.day}: {item.classroom} - {item.subject}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SchedulePage;
