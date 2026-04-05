import React, { useEffect } from 'react'
import EmployeeTimeSheetCard from '../employee-time-sheet-card'
import { useGetTimeSheetByEmployeeId } from '../../apis/queries';
import Loader from '@/components/loader';
import { setTimeSheet } from '@/redux/slices/TimeSheetSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { SessionAuthentication } from '@/modules/auth/guards/SessisonAuthentication';
import type { timesheetType } from '@/types/timesheet';
import { decompressFromEncodedURIComponent } from 'lz-string';

const TimeSheetListComponent: React.FC = () => {

    const dispatch = useAppDispatch()
    const selectedTimeSheetId = useAppSelector((state) => state.timeSheet.timeSheet)

    const session = SessionAuthentication.getSession();
    const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);
    const { data, isPending } = useGetTimeSheetByEmployeeId(decrpyEmployeeId)
    
    useEffect(() => {
        const list = data?.data ?? []
        if (!selectedTimeSheetId && list.length > 0) {
            dispatch(setTimeSheet(list[0].timesheetId))
        }
    }, [data?.data, selectedTimeSheetId, dispatch])


    const getContent = () => {
        if (isPending) {
            return <Loader />
        } else if (data?.data.length === 0) {
            return (
                <div className="flex items-center justify-center">
                    <p>No Timesheets Found</p>
                </div>
            )
        } else {
            return (
                <>
                    {data.data.map((sheet: timesheetType) => (
                        <EmployeeTimeSheetCard key={sheet.timesheetId} sheet={sheet} />
                    ))}
                </>
            );

        }
    }

    return (
        <div className="w-2/5 rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-semibold text-muted">TIMESHEETS</h3>

            <div className='max-h-[70vh] overflow-y-scroll scroll-smooth'>

                <div className="space-y-2">
                    {getContent()}
                </div>
            </div>
        </div>
    )
}

export default TimeSheetListComponent