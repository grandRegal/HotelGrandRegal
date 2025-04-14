import style from './StarBox.module.css';
import full from './assets/full.png';
import half from './assets/half.png';
import empty from './assets/empty.png';

export default ({ count }) => {
    let stars = [];
    for (let i = 1; i <= count; i++) {
        stars.push(<img className={style.fullStar} src={full} />)
    }
    if (Math.round(count) < 4) {
        stars.push(<img className={style.blankStar} src={empty} />)
    } else if (Math.round(count) < 8) {
        stars.push(<img className={style.halfStar} src={half} />)
    } else {
        stars.push(<img className={style.fullStar} src={full} />)
    }
    return (
        <div className={style.starBox}>
            {stars}
        </div>
    )
}