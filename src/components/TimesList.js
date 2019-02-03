import * as React from 'react';

const TimesList = ({ times }) => (
    <ul>
        {times.map(time => (
            <li>
                {time.username} - {time.time}
            </li>
        ))}
    </ul>
);

const withClassName = Component => props => (
    <Component {...props} className="my-class" />
);

export default withClassName(TimesList);
